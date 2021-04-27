package edu.uclm.esi.carreful.http;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import edu.uclm.esi.carreful.dao.CorderDao;
import edu.uclm.esi.carreful.dao.ProductDao;
import edu.uclm.esi.carreful.dao.TokenDao;
import edu.uclm.esi.carreful.model.Carrito;
import edu.uclm.esi.carreful.model.Corder;
import edu.uclm.esi.carreful.model.OrderedProduct;
import edu.uclm.esi.carreful.model.Product;
import edu.uclm.esi.carreful.tokens.Email;
import edu.uclm.esi.carreful.tokens.Token;

@RestController
@RequestMapping("payments")
public class PaymentsController extends CookiesController {
	static {
		Stripe.apiKey = "sk_test_51Idbt0JCT0Jnu2KVa2a6iJ4bzSqcUzxgbBAA3CBAtamPSJ6AKmGIgmg0mqLgCTFwXiqFZxthUIibwveehLvhuYh500oO4f6WcD";
	}
	
	@Autowired
	private CorderDao corderDao;
	@Autowired
	TokenDao tokenDao;
	@Autowired
	ProductDao productDao;
	Corder oproduct = new Corder();	
	
	@PostMapping("/solicitarPreautorizacion/{precioFinal}")
	public String solicitarPreautorizacion(HttpServletRequest request, @RequestBody Map<String, Object> info, @PathVariable Long precioFinal) {
		try {
			//System.out.println(precio);
			Carrito carrito = (Carrito) request.getSession().getAttribute("carrito");
			PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder()
					.setCurrency("eur")
					.setAmount(precioFinal*100)
					.build();
			// Create a PaymentIntent with the order amount and currency
			PaymentIntent intent = PaymentIntent.create(createParams);
			JSONObject jso = new JSONObject(intent.toJson());
			return jso.getString("client_secret");
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	public void controlStock(HttpServletRequest request,Carrito carrito) {
		Collection<OrderedProduct> product = carrito.getProducts();
		Iterator<OrderedProduct> it = product.iterator();
		Iterator<OrderedProduct> it2 = product.iterator();
		ArrayList<Integer> cantidades = new ArrayList<Integer>();
		int i=0;
		while(it2.hasNext()) {
			cantidades.add((int)it2.next().getAmount());
		}	
		while(it.hasNext()) {	
			Long id = it.next().getProduct().getId();
			Product optProduct = productDao.findById(id);
			String stockActual = String.valueOf(Integer.parseInt(optProduct.getStock()) - cantidades.get(i));
			System.out.println(stockActual);
			optProduct.setStock(stockActual);
			productDao.save(optProduct);
			i++;
		}	
	}
	

	@PutMapping("/guardarCambios/{express}")
	public void guardarCambios(HttpServletRequest request,@RequestBody Map<String, Object> info, @PathVariable boolean express) {
		JSONObject jso = new JSONObject(info);
		//System.out.println(express);
		try {
			String ciudad = jso.optString("ciudad");
			String calle = jso.optString("calle");
			String cp =  jso.optString("cp");
			String precio =  jso.optString("precioTotal");
			if ( ciudad.length()==0 || calle.length()==0 || cp.length()==0)
				throw new Exception("Debes rellenar todos los campos");
			oproduct.setCiudad(ciudad);
			oproduct.setCalle(calle);
			oproduct.setCp(cp);	
			if(express) {
				oproduct.setPrecioTotal(Double.parseDouble(precio)+5.5);
			}else {
				oproduct.setPrecioTotal(Double.parseDouble(precio)+3.25);
			}
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
		}
	}
	@GetMapping("/finalizarPago/{receipt_email}")
	public void finalizarPago(HttpServletRequest request, @PathVariable String receipt_email) {
		try {	
			oproduct.setState("pendiente de envio");
			oproduct.setEmail(receipt_email);
			corderDao.save(oproduct);
			//Control de Stock de los pedidos
			Carrito carrito = (Carrito) request.getSession().getAttribute("carrito");
			controlStock(request,carrito);
			request.getSession().removeAttribute("carrito");
			//Enviar email al ususario para el seguimiento del pedido
			Token token = new Token(oproduct.getId());
			tokenDao.save(token);
			Email smtp = new Email();
			String texto = "Para seguir el estado del pedido, pulsa aquí: " + 
				"http://localhost/orders/usarToken/" + token.getId() + "";
			smtp.send(oproduct.getEmail(), "Carreful: Seguimiento del pedido", texto);
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
		}
	}
	
	
}

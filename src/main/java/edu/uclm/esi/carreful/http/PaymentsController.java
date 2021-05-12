package edu.uclm.esi.carreful.http;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestParam;
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
import edu.uclm.esi.carreful.model.DomicilioExpress;
import edu.uclm.esi.carreful.model.DomicilioNormal;
import edu.uclm.esi.carreful.model.Estado;
import edu.uclm.esi.carreful.model.OrderedProduct;
import edu.uclm.esi.carreful.model.Product;
import edu.uclm.esi.carreful.model.RecogidaCarreful;
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
	
	@PostMapping("/solicitarPreautorizacion")
	public String solicitarPreautorizacion(HttpServletRequest request, @RequestBody Map<String, Object> info) {
		try {
			JSONObject json = new JSONObject(info);
			Double precio = Double.parseDouble(json.optString("precio"));
			if (String.valueOf(precio).contains(".")) {
				precio = precio*10;
			}else {
				precio *= 100;
			}
			String precioF = (String.valueOf(precio)).replace(".", "");
			Long precioFinal = Long.parseLong(precioF);	
			PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder()
					.setCurrency("eur")
					.setAmount(precioFinal)
					.build();
			// Create a PaymentIntent with the order amount and currency
			PaymentIntent intent = PaymentIntent.create(createParams);
			JSONObject jso = new JSONObject(intent.toJson());
			return jso.getString("client_secret");
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	public void controlStock(HttpServletRequest request) {
		Carrito carrito = (Carrito) request.getSession().getAttribute("carrito");
		Collection<OrderedProduct> product = carrito.getProducts();
		Iterator<OrderedProduct> it = product.iterator();
		Iterator<OrderedProduct> it2 = product.iterator();
		ArrayList<Integer> cantidades = new ArrayList<>();
		int i=0;
		while(it2.hasNext()) {
			cantidades.add((int)it2.next().getAmount());
		}	
		while(it.hasNext()) {	
			Long id = it.next().getProduct().getId();
			Product optProduct = productDao.findById(id);
			String stockActual = String.valueOf(Integer.parseInt(optProduct.getStock()) - cantidades.get(i));
			optProduct.setStock(stockActual);
			productDao.save(optProduct);
			i++;
		}
		request.getSession().removeAttribute("carrito");
	}
	
	public Double calcularPrecioTotal(HttpServletRequest request) {
		Carrito carrito = (Carrito) request.getSession().getAttribute("carrito");
		Collection<OrderedProduct> product = carrito.getProducts();
		Iterator<OrderedProduct> it = product.iterator();
		Iterator<OrderedProduct> it2 = product.iterator();
		ArrayList<Double> cantidades = new ArrayList<>();
		ArrayList<Double> precios = new ArrayList<>();
		Double precio = 0.0;
		while(it.hasNext()) {
			cantidades.add((it.next().getAmount()));
		}
		while(it2.hasNext()) {
			precios.add(Double.parseDouble(it2.next().getPrecio()));
		}
		for(int i=0;i<cantidades.size();i++) {
			precio += cantidades.get(i)*precios.get(i);
		}
		return precio;
	}
	

	@PutMapping("/guardarCambios/")
	public Double guardarCambios(HttpServletRequest request,@RequestBody Map<String, Object> info) {
		JSONObject jso = new JSONObject(info);
		Double precio = calcularPrecioTotal(request);
		try {
			String ciudad = jso.optString("ciudad");
			String email = jso.optString("email");
			String calle = jso.optString("calle");
			String cp =  jso.optString("cp");
			String modoEnvio = jso.optString("shippingMethod");
			Corder oproduct = new Corder();
			if(modoEnvio.equals("express")) {
				oproduct.setTipo(new DomicilioExpress());
			}else if(modoEnvio.equals("casa")) {
				oproduct.setTipo(new DomicilioNormal());
			}
			else {
				oproduct.setTipo(new RecogidaCarreful());
			}
			if ( email.length()==0 )
				throw new ResponseStatusException(HttpStatus.CONFLICT, "Debes rellenar todos los campos");
			oproduct.setState(Estado.Recibido.name());
			Double precioFinal = (precio + oproduct.getTipo().getGastosEnvio());
			oproduct.setPrecioTotal(precioFinal);
			oproduct.setCiudad(ciudad);
			oproduct.setCalle(calle);
			oproduct.setCp(cp);	
			oproduct.setEmail(email);
			corderDao.save(oproduct);
			request.getSession().setAttribute("corder", oproduct);
			return precioFinal;
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
		}
	}
	
	
	@PutMapping("/finalizarPago")
	public void finalizarPago(HttpServletRequest request) {
		try {	
			Corder oproduct = (Corder) request.getSession().getAttribute("corder");
			//Control de Stock de los pedidos
			controlStock(request);
			//Enviar email al ususario para el seguimiento del pedido
			Token token = new Token();
			Email smtp = new Email();
			String texto = "Para seguir el estado del pedido, pulsa aquí: " + 
				"http://localhost/orders/usarToken/" + token.getId() + "";
			token = new Token(oproduct.getId());
			smtp.send(oproduct.getEmail(), "Carreful: Seguimiento del pedido", texto);	
			tokenDao.save(token);
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
		}
	}
	
	
}

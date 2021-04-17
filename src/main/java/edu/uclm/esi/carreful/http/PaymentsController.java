package edu.uclm.esi.carreful.http;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
import edu.uclm.esi.carreful.model.Carrito;
import edu.uclm.esi.carreful.model.Corder;
import edu.uclm.esi.carreful.model.OrderedProduct;
import edu.uclm.esi.carreful.model.Product;

@RestController
@RequestMapping("payments")
public class PaymentsController extends CookiesController {
	static {
		Stripe.apiKey = "sk_test_51Idbt0JCT0Jnu2KVa2a6iJ4bzSqcUzxgbBAA3CBAtamPSJ6AKmGIgmg0mqLgCTFwXiqFZxthUIibwveehLvhuYh500oO4f6WcD";
	}
	
	@Autowired
	private CorderDao corderDao;
	
	@PostMapping("/solicitarPreautorizacion/{precio}")
	public String solicitarPreautorizacion(HttpServletRequest request, @RequestBody Map<String, Object> info, @PathVariable Long precio) {
		try {
			//System.out.println(precio);
			Carrito carrito = (Carrito) request.getSession().getAttribute("carrito");
			PaymentIntentCreateParams createParams = new PaymentIntentCreateParams.Builder()
					.setCurrency("eur")
					.setAmount(precio)
					.build();
			// Create a PaymentIntent with the order amount and currency
			PaymentIntent intent = PaymentIntent.create(createParams);
			JSONObject jso = new JSONObject(intent.toJson());
			return jso.getString("client_secret");
		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
		}
	}
	
	@PutMapping("/guardarCambios/")
	public void guardarCambios(@RequestBody Map<String, Object> info) {
		JSONObject jso = new JSONObject(info);
		try {
			String email = jso.optString("email");
			String ciudad = jso.optString("ciudad");
			String calle = jso.optString("calle");
			String cp =  jso.optString("cp");
			String precio =  jso.optString("precioTotal");
			if (email.length()==0)
				throw new Exception("Debes indicar el correo");
			if (ciudad.length()==0)
				throw new Exception("Debes indicar la ciudad");
			if (calle.length()==0)
				throw new Exception("Debes indicar el calle");
			if (cp.length()==0)
				throw new Exception("Debes indicar el cp");
			Corder oproduct = new Corder();
			oproduct.setEmail(email);
			oproduct.setCiudad(ciudad);
			oproduct.setCalle(calle);
			oproduct.setCp(cp);
			oproduct.setState("pendiente de envio");
			oproduct.setPrecioTotal(Double.parseDouble(precio));
			corderDao.save(oproduct);
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
		}
	}
	
	
}

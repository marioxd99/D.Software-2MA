package edu.uclm.esi.carreful.http;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import edu.uclm.esi.carreful.model.Carrito;

@RestController
@RequestMapping("payments")
public class PaymentsController extends CookiesController {
	static {
		Stripe.apiKey = "sk_test_51Idbt0JCT0Jnu2KVa2a6iJ4bzSqcUzxgbBAA3CBAtamPSJ6AKmGIgmg0mqLgCTFwXiqFZxthUIibwveehLvhuYh500oO4f6WcD";
	}
	
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
}

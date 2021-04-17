package edu.uclm.esi.carreful.http;

import java.io.IOException;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import edu.uclm.esi.carreful.dao.CorderDao;
import edu.uclm.esi.carreful.dao.TokenDao;
import edu.uclm.esi.carreful.model.Corder;
import edu.uclm.esi.carreful.tokens.Token;

@RestController
@RequestMapping("orders")
public class CorderController extends CookiesController {
	
	@Autowired
	private CorderDao orderDao;
	
	@Autowired
	TokenDao tokenDao;
	
	@GetMapping("get/{orderId}")
	public Corder get(@PathVariable String orderId) {
		try {
			Optional<Corder> optOrder = orderDao.findById(orderId);
			if (optOrder.isPresent())
				return optOrder.get();
			throw new Exception("No se encuentra el pedido");
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage());
		}
		
	}
	
	@GetMapping("usarToken/{tokenId}")
	public String usarToken(HttpServletResponse response, @PathVariable String tokenId) throws IOException {
		Optional<Token> optToken = tokenDao.findById(tokenId);
		if (optToken.isPresent()) {
			Token token = optToken.get();
			if (token.isUsed())
				response.sendError(409, "El token ya se utilizó");
			else {
				response.sendRedirect("http://localhost?ojr=order&token="+tokenId+"&email="+token.getEmail());
			}
		} else {
			response.sendError(404, "El token no existe");
		}
		return null;
	}
	
}

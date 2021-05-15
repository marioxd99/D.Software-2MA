package edu.uclm.esi.carreful.http;

import java.io.IOException;
import java.util.List;
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
import edu.uclm.esi.carreful.model.Domicilio;
import edu.uclm.esi.carreful.model.RecogidaCarreful;
import edu.uclm.esi.carreful.tokens.Token;

@RestController
@RequestMapping("orders")
public class CorderController extends CookiesController {
	
	@Autowired
	CorderDao orderDao;
	
	@Autowired
	TokenDao tokenDao;
	
	@GetMapping("get/{orderId}")
	public Corder get(@PathVariable String orderId) {
		try {
			Optional<Corder> optOrder = orderDao.findById(orderId);
			if (optOrder.isPresent())
				return optOrder.get();
			throw new ResponseStatusException(HttpStatus.CONFLICT, "No se encuentra el pedido");
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
	
	@GetMapping("/getPedidos")
	public List<Corder> get() {
		try {
			return orderDao.findAll();
		} catch(Exception e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
		}
	}
	
	@GetMapping("/changeEstado/{id}")
	public String changeEstado(@PathVariable String id) {
		try {	
			Optional<Corder> optOrder = orderDao.findById(id);
			if(optOrder.get().getCalle().equals("") ) {
				RecogidaCarreful carre = new RecogidaCarreful();
				carre.changeEstado(optOrder);
			}else {
				Domicilio d = new Domicilio(0);			
				d.changeEstado(optOrder);
			}
			orderDao.save(optOrder.get());
			return optOrder.get().getState();
		} catch(NumberFormatException  e) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
		}
	}
	
}

package edu.uclm.esi.carreful.model;

import java.util.Collection;
import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class Carrito {
	private HashMap<String, OrderedProduct> products;
	
	public Carrito() {
		this.products = new HashMap<>();
	}

	public void add(Product product, double amount) {
		OrderedProduct orderedProduct = this.products.get(product.getNombre());
		if (orderedProduct==null) {
			orderedProduct = new OrderedProduct(product, amount);
			this.products.put(product.getNombre(), orderedProduct);
			orderedProduct.setPrecio(product.getPrecio());
			orderedProduct.setImage(product.getImage());
			orderedProduct.setNombre(product.getNombre());
			orderedProduct.setCategoria(product.getCategoria());
		} else {
			try {
			if(Integer.parseInt(product.getStock())>orderedProduct.getAmount()) { 
				orderedProduct.addAmount(amount);
			}else 
				throw new Exception("No hay stock suficiente de "+product.getNombre());			
			} catch(Exception e) {
				throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
			}
		}
	}
	
	public void delete(Product product,double amount) {
		OrderedProduct orderedProduct = this.products.get(product.getNombre());
		if ( orderedProduct!=null) {
			orderedProduct.removeAmount(amount);
			if(orderedProduct.getAmount()<1) {
				this.products.remove(product.getNombre(),orderedProduct);
			}
		}
		
	}

	public Collection<OrderedProduct> getProducts() {
		return products.values();
	}
}

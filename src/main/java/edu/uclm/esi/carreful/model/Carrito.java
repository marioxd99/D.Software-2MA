package edu.uclm.esi.carreful.model;

import java.util.Collection;
import java.util.HashMap;

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
		} else {
			orderedProduct.addAmount(amount);
			System.out.println(product.getPrecio());
			orderedProduct.setPrecio(product.getPrecio());
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

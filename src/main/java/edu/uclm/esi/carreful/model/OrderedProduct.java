package edu.uclm.esi.carreful.model;

import javax.persistence.Column;
import javax.persistence.Lob;

public class OrderedProduct {
	private Product product;
	private double amount;
	private String precio;
	@Lob
	private String image;
	
	
	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}


	public String getPrecio() {
		return precio;
	}

	public void setPrecio(String precio) {
		this.precio = precio;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public OrderedProduct(Product product, double amount) {
		this.product = product;
		this.amount = amount;
	}

	public void addAmount(double amount) {
		this.amount+=amount;
	}
	
	public void removeAmount(double amount) {
		this.amount-=amount;
	}
	
	public double getAmount() {
		return amount;
	}
	
	public String getName() {
		return this.product.getNombre();
	}
}

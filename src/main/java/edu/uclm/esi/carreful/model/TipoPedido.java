package edu.uclm.esi.carreful.model;

public abstract class TipoPedido {
	private double gastosEnvio;
	
	public TipoPedido(double gastosEnvio) {
		super();
		this.gastosEnvio = gastosEnvio;
	}
	
	public double getGastosEnvio() {
		return gastosEnvio;
	}
	
	public void setGastosEnvio(double gastosEnvio) {
		this.gastosEnvio = gastosEnvio;
	}
	
	
	
}

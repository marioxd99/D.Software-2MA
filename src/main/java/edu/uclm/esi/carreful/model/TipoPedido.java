package edu.uclm.esi.carreful.model;

public abstract class TipoPedido {
	private double gastosEnvio;
	protected Estado estado;
	
	public TipoPedido(double gastosEnvio) {
		super();
		this.gastosEnvio = gastosEnvio;
	}
	
	public abstract void changeEstado();
	
	public Estado getEstado() {
		return estado;
	}
	
	public double getGastosEnvio() {
		return gastosEnvio;
	}
	
	public void setGastosEnvio(double gastosEnvio) {
		this.gastosEnvio = gastosEnvio;
	}
	
	
	
}

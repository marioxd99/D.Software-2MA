package edu.uclm.esi.carreful.model;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Transient;

@Entity
public class Corder {
	@Id @Column(length = 36)
	private String id;
	private String email;
	private String ciudad;
	private String calle;
	@Column(length = 10)
	private String cp;
	private double precioTotal;
	private String state;
	@Transient
	private TipoPedido tipo;
	
	public void changeEstado() {
		this.tipo.changeEstado(this);
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCiudad() {
		return ciudad;
	}

	public void setCiudad(String ciudad) {
		this.ciudad = ciudad;
	}

	public String getCalle() {
		return calle;
	}

	public void setCalle(String calle) {
		this.calle = calle;
	}

	public String getCp() {
		return cp;
	}

	public void setCp(String cp) {
		this.cp = cp;
	}

	public Corder() {
		this.id = UUID.randomUUID().toString();
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public double getPrecioTotal() {
		return precioTotal;
	}
	public void setPrecioTotal(double precioTotal) {
		this.precioTotal = precioTotal;
	}

	public String getState() {
		return state;
	}
	
	public void setState(String state) {
		this.state = state;
	}
	
	public TipoPedido getTipo() {
		return tipo;
	}
	
	public void setTipo(TipoPedido tipo) {
		this.tipo = tipo;
	}
}

package edu.uclm.esi.carreful.model;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;


public class Domicilio extends TipoPedido {
	
	public Domicilio(double gastosEnvio) {
		super(gastosEnvio);
	}

	
	
	
}

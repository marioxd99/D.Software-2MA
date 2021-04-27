package edu.uclm.esi.carreful.model;

import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;


public class DomicilioNormal extends Domicilio {
	
	public DomicilioNormal(double gastosEnvio) {
		super(3.25);
	}

	
}

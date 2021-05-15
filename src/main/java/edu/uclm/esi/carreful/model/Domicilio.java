package edu.uclm.esi.carreful.model;

import java.util.Optional;

public class Domicilio extends TipoPedido {
	
	public Domicilio(double gastosEnvio) {
		super(gastosEnvio);
	}

	@Override
	public void changeEstado(Corder order) {
		if(order.getState().equals(Estado.Recibido.name())) {
			order.setState(Estado.Preparado.name());
		}else if(order.getState().equals(Estado.Preparado.name())){
			order.setState(Estado.EnCamino.name());
		}else {
			order.setState(Estado.Entregado.name());
		}
	}

	
}

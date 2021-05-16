package edu.uclm.esi.carreful.model;

import java.util.Optional;

public class Domicilio extends TipoPedido {
	
	public Domicilio(double gastosEnvio) {
		super(gastosEnvio);
	}

	public void changeEstado(Optional<Corder> order) {
		if (order.isPresent()) {
			if(order.get().getState().equals(Estado.Recibido.name())) {
				order.get().setState(Estado.Preparado.name());
			}else if(order.get().getState().equals(Estado.Preparado.name())){
				order.get().setState(Estado.EnCamino.name());
			}else {
				order.get().setState(Estado.Entregado.name());
			}
		}
	}

	@Override
	public void changeEstado(Corder order) {
		// Do nothing 
	}

	
}

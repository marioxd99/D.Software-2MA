package edu.uclm.esi.carreful.model;

public class DomicilioNormal extends Domicilio {
	
	public DomicilioNormal(double gastosEnvio) {
		super(3.25);
	}
	

	
	@Override
	public void changeEstado(Corder pedido) {
		if(pedido.getState().equals(Estado.Estados.Recibido.name())) {
			pedido.setState(Estado.Estados.Preparado.name());
		}else if(pedido.getState().equals(Estado.Estados.Preparado.name())){
			pedido.setState(Estado.Estados.EnCamino.name());
		}else {
			pedido.setState(Estado.Estados.Entregado.name());
		}
	}

	
}

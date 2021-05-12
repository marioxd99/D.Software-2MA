package edu.uclm.esi.carreful.model;

public class Domicilio extends TipoPedido {
	
	public Domicilio(double gastosEnvio) {
		super(gastosEnvio);
	}

	@Override
	public void changeEstado(Corder pedido) {
		if(pedido.getState().equals(Estado.Recibido.name())) {
			pedido.setState(Estado.Preparado.name());
		}else if(pedido.getState().equals(Estado.Preparado.name())){
			pedido.setState(Estado.EnCamino.name());
		}else {
			pedido.setState(Estado.Entregado.name());
		}
	}
	

	
	
}

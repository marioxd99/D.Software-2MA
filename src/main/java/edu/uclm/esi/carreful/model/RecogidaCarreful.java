package edu.uclm.esi.carreful.model;

public class RecogidaCarreful extends TipoPedido {
	
	public RecogidaCarreful(double gastosEnvio) {
		super(0);
	}

	@Override
	public void changeEstado() {
		
	}
	
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

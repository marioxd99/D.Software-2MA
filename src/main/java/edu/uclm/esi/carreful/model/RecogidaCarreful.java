package edu.uclm.esi.carreful.model;

public class RecogidaCarreful extends TipoPedido {
	
	public RecogidaCarreful() {
		super(0);
	}
	
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

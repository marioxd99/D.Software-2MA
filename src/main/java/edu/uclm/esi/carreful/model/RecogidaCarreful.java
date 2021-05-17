package edu.uclm.esi.carreful.model;

import java.util.Optional;

public class RecogidaCarreful extends TipoPedido {
	
	public RecogidaCarreful() {
		super(0);
	}
	
	public void changeEstado(Optional<Corder> pedido) {
		if (pedido.isPresent()) {
			if(pedido.get().getState().equals(Estado.Recibido.name())) {
				pedido.get().setState(Estado.Preparado.name());
			}else if(pedido.get().getState().equals(Estado.Preparado.name())){
				pedido.get().setState(Estado.Entregado.name());
			}
		}
	}

	@Override
	public void changeEstado(Corder order) {
		// TODO Auto-generated method stub
		
	}



	
	
}

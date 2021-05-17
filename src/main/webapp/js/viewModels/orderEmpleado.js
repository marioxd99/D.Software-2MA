define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {

	class OrderEmpleadoViewModel {
		constructor() {
			var self = this;
						
			self.pedidos = ko.observableArray([]);
			// Header Config
			self.headerConfig = ko.observable({
				'view' : [],
				'viewModel' : null
			});
			moduleUtils.createView({
				'viewPath' : 'views/header.html'
			}).then(function(view) {
				self.headerConfig({
					'view' : view,
					'viewModel' : app.getHeaderModel()
				})
			})
		}
		
		getPedidos() {
			let self = this;
			let data = {
				url : "orders/getPedidos",
				type : "get",
				contentType : 'application/json',
				success : function(response) {
					 self.pedidos([]);
					 for (let i=0; i<response.length; i++) {
						let pedido = {
							id : response[i].id,
							email : response[i].email,
							ciudad : response[i].ciudad,
							calle : response[i].calle,
							cp : response[i].cp,
							precioTotal : response[i].precioTotal,
							state : response[i].state,	
							changeEstado : function() {
								self.changeEstado(response[i].id); 
							}	
						};
						self.pedidos.push(pedido);
					}
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		}
		
		changeEstado(id) {
			let self = this;
			let data = {
				url : "orders/changeEstado/" + id,
				type : "get",
				contentType : 'application/json',
				success : function(response) {
					self.getPedidos();			
				}
			};
			$.ajax(data);
		}

		connected() {
			accUtils.announce('Pedido page loaded.');
			document.title = "Pedidos";
			this.getPedidos();
		};

		disconnected() {
			// Implement if needed
		};

		transitionCompleted() {
			// Implement if needed
		};
	}

	return OrderEmpleadoViewModel;
});

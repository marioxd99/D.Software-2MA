define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {

let estadoPedido;
	
	class CartViewModel {
		constructor() {
			var self = this;
			
			self.message = ko.observable();
			self.error = ko.observable();
			
			self.estado = ko.observable();
			self.email = ko.observable();
			self.calle = ko.observable();
			self.ciudad = ko.observable();
			self.cp = ko.observable();
			
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
			
		getPedido(orderId) {
			let self = this;
			let pedido;
			let data = {
				url : "orders/get/" + orderId,
				type : "get",
				contentType : 'application/json',
				success : function(response) {		
					console.log(response);		
					self.estado = self.estado(response.state);
					self.email = self.email(response.email);
					self.ciudad = self.ciudad(response.ciudad);
					self.calle = self.calle(response.calle);
					self.cp = self.cp(response.cp);
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		}

		
		connected() {
			accUtils.announce('Cart page loaded.');
			document.title = "Pedido";
			var url = location.href;
			url = url.substring(77)
			this.getPedido(url);			
		};

		disconnected() {
			// Implement if needed
		};

		transitionCompleted() {
			// Implement if needed
		};
	}

	return CartViewModel;
});

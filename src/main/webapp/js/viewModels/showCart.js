define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {

	class CartViewModel {
		constructor() {
			var self = this;
			
			self.message = ko.observable();
			self.error = ko.observable();
			
			self.carrito = ko.observable(JSON.parse(sessionStorage.carrito));
			//sessionStorage.removeItem("carrito");
			//self.carrito = ko.observable(app.carrito);
			
			 
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
		
		precioCarrito() {
			let self = this;
			let precio = 0;
			let data = {
				url : "product/precioCarrito/",
				type : "get",
				contentType : 'application/json',
				success : function(response) {			
					console.log(response);
					for (let i=0; i<response.length; i++) {
							precio += parseFloat(response[i].precio) *  parseFloat(response[i].amount);										
					};	
					console.log(precio);
					document.getElementById('precioTotal').innerHTML = precio;		
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		};
		
		eliminarCarrito(id) {
			let self = this;
			let data = {
				url : "product/eliminarCarrito/" + id,
				type : "delete",
				contentType : 'application/json',
				success : function(response) {
					self.message("Producto eliminado del carrito");
					self.carrito(response.products);
					self.precioCarrito();
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		}
		
		volver() {
			app.router.go( { path : "productClient"} );
			$.ajax(data);
		};
		
		aPagar() {
			app.router.go( { path : "payment"} );
			$.ajax(data);
		};
		
		

		connected() {
			accUtils.announce('Cart page loaded.');
			document.title = "Cart";
			this.precioCarrito();
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

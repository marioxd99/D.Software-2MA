define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {
		
let precio = 0;

	class CartViewModel {
		constructor() {
			var self = this;
			
			self.botonVisible = ko.observable(2);
			self.message = ko.observable();
			self.error = ko.observable();
			
			self.precioCarro = ko.observable(0);
			self.carrito = ko.observable(JSON.parse(sessionStorage.carrito));
			
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
			precio = 0.0;
			let data = {
				url : "product/precioCarrito/",
				type : "get",
				contentType : 'application/json',
				success : function(response) {			
					for (let i=0; i<response.length; i++) {
							precio += parseFloat(response[i].precio) *  parseFloat(response[i].amount);									
					};	
					self.precioCarro(precio);	
					if(precio == 0){
						self.botonVisible(1);
					}else{
						self.botonVisible(2);
					}
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
		
		addAlCarrito(id) {
			let self = this;
			let data = {
				url : "product/addAlCarrito/" + id,
				type : "post",
				contentType : 'application/json',
				success : function(response) {
					self.message("Producto añadido al carrito");
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
		};
		
		aPagar() {
			console.log(precio);
			sessionStorage.pago = JSON.stringify(precio);
			app.router.go( { path : "payment"} );
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

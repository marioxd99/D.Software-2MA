define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {

	class CartViewModel {
		constructor() {
			var self = this;
			
			self.message = ko.observable();
			self.error = ko.observable();
			
			//self.carrito = ko.observable(JSON.parse(sessionStorage.carrito));
			//sessionStorage.removeItem("carrito");
			self.carrito = ko.observable(app.carrito);
			
			 
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

		register() {
			app.router.go( { path : "register" } );
		}

		connected() {
			accUtils.announce('Cart page loaded.');
			document.title = "Cart";
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

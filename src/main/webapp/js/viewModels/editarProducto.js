define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {

	class MenuViewModel {
		constructor() {
			var self = this;
			
			self.setImage = function(widget, event) {
				var file = event.target.files[0];
				var reader = new FileReader();
				reader.onload = function () {
				self.image ("data:image/png;base64," + btoa(reader.result));
				}
				reader.readAsBinaryString(file);
			}
			
			self.producto = ko.observable(app.producto); // ko.observable(JSON.parse(sessionStorage.producto));
			sessionStorage.removeItem("producto");
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
		
		edit(nombre) {
			var self = this;
			let info = {
				nombre : this.nombre(),
				precio : this.precio(),
				codigo : this.codigo(),
				image : this.image()
			};
			let data = {
				data : JSON.stringify(info),
				url : "product/editar" + nombre,
				type : "put",
				contentType : 'application/json',
				success : function(response) {
					self.message("Producto Modificado");
					self.getProductos();
					app.router.go( { path : "product"} );
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		}

		connected() {
			accUtils.announce('Edit Product page loaded.');
			document.title = "Editar";
		};

		disconnected() {
			// Implement if needed
		};

		transitionCompleted() {
			// Implement if needed
		};
	}

	return MenuViewModel;
});

define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {


	class EditarProductoViewModel {
		constructor() {
			var self = this;
			
			self.nombre = ko.observable();
			self.codigo = ko.observable();
			self.precio = ko.observable();
			self.image = ko.observable();
			
			self.message = ko.observable(null);
			self.error = ko.observable(null);
			
			self.productos = ko.observableArray([]);
			
			self.setImage = function(widget, event) {
				console.log("dentro del setImage");
				var dentroImagen = true;
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
		
		getProductos() {
			let self = this;
			let data = {
				url : "product/getTodos",
				type : "get",
				contentType : 'application/json',
				success : function(response) {
					//self.productos(response);
					
					 for (let i=0; i<response.length; i++) {
						let producto = {
							codigo : response[i].codigo,
							nombre : response[i].nombre,
							precio : response[i].precio,
							image  : response[i].image,
						};
						self.productos.push(producto);
					}
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		}
		
		edit() {
			var self = this;
			let info = {
				id : document.getElementById("idProducto").value,
				nombre : document.getElementById("nombreProducto").value,
				precio : document.getElementById("precioProducto").value,
				codigo : document.getElementById("codigoProducto").value,
				stock  : document.getElementById("stockProducto").value,
				image  : this.image(),
			};
			if (info.image == null){
				info.image =  $("img").attr("src");
			}else{
				info.image = this.image();
			}
			console.log(info.image);
			let data = {
				data : JSON.stringify(info),
				url : "product/editar" ,
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
			document.title = "Editar Producto";
		};

		disconnected() {
			// Implement if needed
		};

		transitionCompleted() {
			// Implement if needed
		};
	}

	return EditarProductoViewModel;
});

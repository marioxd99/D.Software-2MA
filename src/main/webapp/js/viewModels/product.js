define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {

	class ProductViewModel {
		constructor() {
			var self = this;
			
			self.nProductos = ko.observable();
			self.nombre = ko.observable("Detergente");
			self.codigo = ko.observable("001");
			self.precio = ko.observable("8,50 €");
			self.categoria = ko.observable("Tecnologia");
			self.stock = ko.observable();
			self.image = ko.observable();
			self.imagen = ko.observable();

			self.productos = ko.observableArray([]);
			self.categorias = ko.observableArray([]);
			self.carrito = ko.observableArray([]);
			
			self.message = ko.observable(null);
			self.error = ko.observable(null);
			
			self.setImage = function(widget, event) {
				var file = event.target.files[0];
				var reader = new FileReader();
				reader.onload = function () {
				self.image ("data:image/png;base64," + btoa(reader.result));
				}
				reader.readAsBinaryString(file);
			}
			
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

		add() {
			var self = this;
			let info = {
				nombre : this.nombre(),
				precio : this.precio(),
				codigo : this.codigo(),
				categoria : this.categoria(),
				stock: this.stock(),
				image : this.image()
			};
			let data = {
				data : JSON.stringify(info),
				url : "product/add",
				type : "put",
				contentType : 'application/json',
				success : function(response) {
					self.message("Producto guardado");
					self.getProductos();
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		}	
		
		
		getProductos() {
			let self = this;
			let data = {
				url : "product/getTodos",
				type : "get",
				contentType : 'application/json',
				success : function(response) {
					self.productos([]);
					
					 for (let i=0; i<response.length; i++) {
						let producto = {
							id : response[i].id,
							codigo : response[i].codigo,
							nombre : response[i].nombre,
							precio : response[i].precio,
							categoria : response[i].categoria,
							stock : response[i].stock,
							image  : response[i].image,
							eliminar : function() {
								self.eliminarProducto(response[i].nombre); 
							},
							editar : function() {
								//sessionStorage.producto = JSON.stringify(response[i]);
								app.producto = this;
								console.log(response[i].id);
								app.router.go( { path : "editarProducto"} );
							},						
						};
						self.productos.push(producto);
						var numeroProductos = response.length;
						numeroProductos = numeroProductos.toString();
						self.nProductos(numeroProductos);
					}
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		}
		
		getCategorias() {
			let self = this;
			let data = {
				url : "product/getCategorias",
				type : "get",
				contentType : 'application/json',
				success : function(response) {	
					for (let i=0; i<response.length; i++) {
						let categoria = {
							nombre : response[i],
							imagen :  ko.observable(null)
						};
						self.getImagen(categoria);
						self.categorias.push(categoria);
					}	
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		}
		
		getImagen(categoria) {
			let self = this;
			let data = {
				url : "product/getImagen/" + categoria.nombre,
				type : "get",
				contentType : 'application/json',
				success : function(response) {
					categoria.imagen(response);					
				}
			};
			$.ajax(data);
		}
		
		getProductoCategoria(categoria) {
			let self = this;
			let data = {
				url : "product/getCategoria/" + categoria,
				type : "get",
				contentType : 'application/json',
				success : function(response) {
					self.productos([]);
					for (let i=0; i<response.length; i++) {
						let producto = {
							id: response[i].id,
							codigo : response[i].codigo,
							nombre : response[i].nombre,
							precio : response[i].precio,
							categoria : response[i].categoria,
							stock : response[i].stock,
							image  : response[i].image,
							eliminar : function() {
								self.eliminarProducto(response[i].nombre); 
							},
							editar : function() {
								//sessionStorage.producto = JSON.stringify(response[i]);
								app.producto = this;
								console.log(response[i].id);
								app.router.go( { path : "editarProducto"} );
							},
						};
						self.productos.push(producto);
						var numeroProductos = response.length;
						numeroProductos = numeroProductos.toString();
						self.nProductos(numeroProductos);
					}
					
				}
			};
			$.ajax(data);
		}
		
		eliminarProducto(id){
			let self = this;
			let data = {
				url : "product/borrarProducto/" + id,
				type : "delete",
				contentType : 'application/json',
				success : function(response) {
					self.message("Producto eliminado");
					self.getProductos();
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		}
		
		
		logout() {
			let self = this;
			let data = {
				url : "user/logout",
				type : "post",
				contentType : 'application/json',
				success : function(response) {
					app.router.go( { path : "login" } );
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		}
		
		register() {
			app.router.go( { path : "register" } );
		}

		connected() {
			accUtils.announce('Product page loaded.');
			document.title = "Producto";
			
			this.getCategorias();
			this.getProductos();
		};

		disconnected() {
			// Implement if needed
		};

		transitionCompleted() {
			// Implement if needed
		};
	}

	return ProductViewModel;
});

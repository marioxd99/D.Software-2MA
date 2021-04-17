define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {

	class ProductViewModel {
		constructor() {
			var self = this;
			
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
						var numeroProductosHTML = document.getElementById('nProducto').innerHTML = numeroProductos;
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
						document.getElementById('nProducto').innerHTML = numeroProductos;
					}
					
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
		
		precioCarrito() {
			let self = this;
			let precio = 0;
			let data = {
				url : "product/precioCarrito/",
				type : "get",
				contentType : 'application/json',
				success : function(response) {			
					for (let i=0; i<response.length; i++) {
							precio += parseFloat(response[i].precio) *  parseFloat(response[i].amount);										
					};	
					document.getElementById('precioTotal').innerHTML = precio;		
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		};
		
		mostrarCarrito() {
			let self = this;
			let data = {
				url : "product/mostrarCarrito/",
				type : "get",
				contentType : 'application/json',
				success : function(response) {			
					//app.carrito = response.products;
					//console.log(app.carrito);
					sessionStorage.carrito = JSON.stringify(response.products);
					app.router.go( { path : "showCart"} );
				},
				error : function(response) {
					self.error(response.responseJSON.errorMessage);
				}
			};
			$.ajax(data);
		}
		
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
		
		register() {
			app.router.go( { path : "register" } );
		}

		connected() {
			accUtils.announce('Product page loaded.');
			document.title = "Producto";
			
			this.getCategorias();
			this.getProductos();
			this.precioCarrito();
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

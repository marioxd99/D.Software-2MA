define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
	'jquery'], function(ko, app, moduleUtils, accUtils, $) {

let precio = sessionStorage.pago;

		class PaymentViewModel {
			constructor() {
				var self = this;

				self.stripe = Stripe('pk_test_51Idbt0JCT0Jnu2KVyUblcQGrEc6z1AkvRcfeQ0ZriuHepoGSqa7jhkotStsp3KT7Y7bkLl0W83AH73cMP9Xu9bxJ00CWoMvhBX');
				
				self.pasoVisible = ko.observable(1);
				self.precioPagoVisible = ko.observable(1);
				self.continuarVisible = ko.observable(1);
				self.pagoVisible = ko.observable(1);
				self.congeladosVisible = ko.observable(1);
				self.casasVisible = ko.observable(1);
				
				self.pago = ko.observable(sessionStorage.pago);
				self.email = ko.observable();
				self.calle = ko.observable();
				self.ciudad = ko.observable();
				self.cp = ko.observable();
				self.shippingMode = ko.observable();
				self.gastosEnvio = ko.observable();
				self.precioApagar = ko.observable(sessionStorage.pago);
				
				self.message = ko.observable();
				self.error = ko.observable();

				self.headerConfig = ko.observable({
					'view': [],
					'viewModel': null
				});
				moduleUtils.createView({
					'viewPath': 'views/header.html'
				}).then(function(view) {
					self.headerConfig({
						'view': view,
						'viewModel': app.getHeaderModel()
					})
				})
			}

			finalizarPago(receipt_email) {
				var self = this;
				var data = {
					url: "payments/finalizarPago",
					type: "put",
					contentType: 'application/json',
					success: function(response) {
						self.message("Pago realizado correctamente");
						alert("Pago realizado correctamente");
						app.router.go({ path: "productClient" });
					},
					error: function(response) {
						self.error(response.responseJSON.errorMessage);
					}
				};
				$.ajax(data);
			};
			
			guardarCambios() {
				var self = this;
				let info = {
					email: self.email(),
					ciudad: self.ciudad(),
					calle: self.calle(),
					cp: self.cp(),
					shippingMethod: self.shippingMode(),
				};
				
				let data = {
					data: JSON.stringify(info),
					url: "payments/guardarCambios/",
					type: "put",
					contentType: 'application/json',
					success: function(response) {
						self.message("Cambios guardados");
						self.precioPagoVisible(2);
						self.continuarVisible = self.continuarVisible(2);
						self.pasoVisible(2);
						self.pagoVisible(2);
						self.solicitarPreautorizacion();
						self.pasoVisible(2);
						self.precioApagar = self.precioApagar(response);
						precio = response;	
					},
					error: function(response) {
						self.error(response.responseJSON.errorMessage);
					}
				};
				$.ajax(data);
			}
			
			
			volver() {
				app.router.go({ path: "showCart" });
			};
				
			precioCarrito() {
				let self = this;
				let data = {
					url : "product/precioCarrito/",
					type : "get",
					contentType : 'application/json',
					success : function(response) {			
						for (let i=0; i<response.length; i++) {
								if(response[i].categoria == 'Congelados'){
									self.casasVisible(2);
									self.congeladosVisible(2);
								}										
						};
					},
					error : function(response) {
						self.error(response.responseJSON.errorMessage);
					}
				};
				$.ajax(data);
			};

			connected() {
				accUtils.announce('Pay page loaded.');
				document.title = "Pago";
				precio = sessionStorage.pago;
				console.log(precio);
				this.precioCarrito();
			};

			solicitarPreautorizacion() {
				let self = this;
				let data = {
					url: "payments/solicitarPreautorizacion",
					type: "post",
					contentType: 'application/json',
					success: function(response) {
						self.clientSecret = response;
						self.rellenarFormulario();
					},
					erro: function(response) {
						self.error(response.responseJSON.errorMessage);
					}
				};
				$.ajax(data);
			}

			rellenarFormulario() {
				let self = this;
				var elements = self.stripe.elements();
				var style = {
					base: {
						color: "#32325d",
						fontFamily: 'Arial, sans-serif',
						fontSmoothing: "antialiased",
						fontSize: "16px",
						"::placeholder": {
							color: "#32325d"
						}
					},
					invalid: {
						fontFamily: 'Arial, sans-serif',
						color: "#fa755a",
						iconColor: "#fa755a"
					}
				};

				var card = elements.create("card", { style: style });
				// Stripe injects an iframe into the DOM
				card.mount("#card-element");
				card.on("change", function(vent) {
					// Disable the Pay button if there are no card details in the Element
					document.querySelector("button").disabled = event.empty;
					document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
				});

				var form = document.getElementById("payment-form");
				form.addEventListener("submit", function(event) {
					event.preventDefault();
					// Complete payment when the submit button is clicked
					if ($('#email').val().length == 0) {
					 	alert('Ingrese el email');
					}else{
						self.loading(true);
						self.payWithCard(card);
					}
				});
			}
			
			loading() {
				document.querySelector("button").disabled = true;
				document.querySelector("#spinner").classList.remove("hidden");
				document.querySelector("#button-text").classList.add("hidden");	
			};
			
			loading2() {
					document.querySelector("button").disabled = false;
					document.querySelector("#spinner").classList.add("hidden");
					document.querySelector("#button-text").classList.remove("hidden");
			};

			payWithCard(card) {
				let self = this;
				let receipt_email = document.getElementById('email').value
				self.stripe.confirmCardPayment(self.clientSecret, {
					payment_method: {
						card: card
					}
				}).then(function(result) {
					if (result.error) {
						// Show error to your customer (e.g., insufficient funds)
						self.error(result.error.message);
					} else {
						// The payment has been processed!
						if (result.paymentIntent.status === 'succeeded') {
							var mensajeExito = document.getElementById('mensajeExitoso');
							mensajeExito.style.display = 'block';
							self.finalizarPago(receipt_email);
							self.loading2();
						}
					}
				});
			};
		};
		
		return PaymentViewModel;
	});

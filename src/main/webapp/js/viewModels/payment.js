define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
	'jquery'], function(ko, app, moduleUtils, accUtils, $) {

		let precio = sessionStorage.pago;
		var express = false;
		class PaymentViewModel {
			constructor() {
				var self = this;

				self.stripe = Stripe('pk_test_51Idbt0JCT0Jnu2KVyUblcQGrEc6z1AkvRcfeQ0ZriuHepoGSqa7jhkotStsp3KT7Y7bkLl0W83AH73cMP9Xu9bxJ00CWoMvhBX');

				self.pago = ko.observable(sessionStorage.pago);
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
					url: "payments/finalizarPago/" + receipt_email,
					type: "get",
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
			
			continuar() {
				if(document.getElementById("recogida").checked){
					document.getElementById("datosPersonales").style.display = 'none';
					this.solicitarPreautorizacion();
					document.getElementById('precioApagar').innerHTML = sessionStorage.pago;
					var formPago = document.getElementById('pagosForm');
					formPago.style.display = 'block';
					document.getElementById("continue").style.display = 'none';
				}else if(document.getElementById("express").checked){
					document.getElementById("datosPersonales").style.display = 'block';
					document.getElementById("continue").style.display = 'none';
				}else  if(document.getElementById("casa").checked){
					document.getElementById("datosPersonales").style.display = 'block';
					document.getElementById("continue").style.display = 'none';
				}

			};

			guardarCambios() {
				var self = this;
				let info = {
					email: document.getElementById("email").value,
					ciudad: document.getElementById("ciudad").value,
					calle: document.getElementById("calle").value,
					cp: document.getElementById("cp").value,
					precioTotal: precio
				};

				if(document.getElementById("express").checked){
					express = true;
				}
				let data = {
					data: JSON.stringify(info),
					url: "payments/guardarCambios/" + express,
					type: "put",
					contentType: 'application/json',
					success: function(response) {
						self.message("Cambios guardados");
						var formPago = document.getElementById('pagosForm');
						formPago.style.display = 'block';
						if(express){
							precio = parseFloat(sessionStorage.pago) + 5,5;
							console.log(precio);
							document.getElementById('precioApagar').innerHTML = precio;
						}else{
							precio = parseFloat(sessionStorage.pago) + 3,25;
							console.log(precio);
							document.getElementById('precioApagar').innerHTML = precio;
						}
						self.solicitarPreautorizacion();
						document.getElementById("datosPersonales").style.display = 'none';		
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
									document.getElementById("casas").style.display = 'none';
									document.getElementById("mensajeCongelados").style.display = 'block';
								}											
						};	
						console.log(precio);
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
				this.precioCarrito();
				document.getElementById("mensajeCongelados").style.display = 'none';
				var formPago = document.getElementById('pagosForm');
				formPago.style.display = 'none';
				document.getElementById("datosPersonales").style.display = 'none';
			};

			solicitarPreautorizacion() {
				let self = this;
				// The items the customer wants to buy
				let purchase = {
					items: [{ id: "xl-tshirt" }]
				};

				let data = {
					data: JSON.stringify(purchase),
					url: "payments/solicitarPreautorizacion/" + precio,
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

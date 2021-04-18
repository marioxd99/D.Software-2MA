define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
	'jquery'], function(ko, app, moduleUtils, accUtils, $) {
	
let precio = sessionStorage.pago;
var productos = JSON.parse(sessionStorage.carrito);

		class PaymentViewModel {
			constructor() {
				var self = this;

				self.stripe = Stripe('pk_test_51Idbt0JCT0Jnu2KVyUblcQGrEc6z1AkvRcfeQ0ZriuHepoGSqa7jhkotStsp3KT7Y7bkLl0W83AH73cMP9Xu9bxJ00CWoMvhBX');

				self.pago = ko.observable(sessionStorage.pago);			
				//self.carrito = ko.observable(JSON.parse(sessionStorage.carrito));
				console.log(productos[1].amount);
				
				self.message = ko.observable();
				self.error = ko.observable();

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

			guardarCambios() {
				var self = this;
				let info = {
					email : document.getElementById("email").value,
					ciudad : document.getElementById("ciudad").value,
					calle : document.getElementById("calle").value,
					cp : document.getElementById("cp").value,
					precioTotal : precio
				};
				let data = {
					data : JSON.stringify(info),
					url : "payments/guardarCambios/",
					type : "put",
					contentType : 'application/json',
					success : function(response) {
						self.message("Cambios guardados");
					},
					error : function(response) {
						self.error(response.responseJSON.errorMessage);
					}
				};
				$.ajax(data);
			}
			
			volver() {
				app.router.go( { path : "showCart"} );
			};

			connected() {
				accUtils.announce('Pay page loaded.');
				document.title = "Pago";
				this.solicitarPreautorizacion();
				document.getElementById('precioApagar').innerHTML = sessionStorage.pago;
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
					type : "post",
					contentType : 'application/json',
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
					self.payWithCard(card);
				});
			}

			payWithCard(card){
				let self = this;
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
					}
				}
			});			
		};


		disconnected() {
			// Implement if needed
		};
		
		transitionCompleted() {
			// Implement if needed
		};
			}

		return PaymentViewModel;
	});

define(['knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
	'jquery'], function(ko, app, moduleUtils, accUtils, $) {

		class PaymentViewModel {
			constructor() {
				var self = this;

				self.stripe = Stripe('pk_test_51Idbt0JCT0Jnu2KVyUblcQGrEc6z1AkvRcfeQ0ZriuHepoGSqa7jhkotStsp3KT7Y7bkLl0W83AH73cMP9Xu9bxJ00CWoMvhBX',
				{ apiVersion: "2020-08-27", });

				self.message = ko.observable(null);
				self.error = ko.observable(null);

				// Header Config
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

			connected() {
				accUtils.announce('Menu page loaded.');
				document.title = "Pagos";
				this.solicitarPreautorizacion();

			};

			solicitarPreautorizacion() {
				
			}


			disconnected() {
				// Implement if needed
			};

			transitionCompleted() {
				// Implement if needed
			};
		}

		return PaymentViewModel;
	});

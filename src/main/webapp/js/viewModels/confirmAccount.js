define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {

	class MenuViewModel {
		constructor() {
			var self = this;
						
			self.email = ko.observable();
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
		
		

		connected() {
			accUtils.announce('Menu page loaded.');
			document.title = "Confirmar cuenta";
        
			var url = location.href;
			url = url.substring(86)
			this.email(url);
		}

		disconnected() {
			// Implement if needed
		}

		transitionCompleted() {
			// Implement if needed
		}
	}

	return MenuViewModel;
});

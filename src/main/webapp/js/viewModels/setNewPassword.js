
define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {

	function RegisterViewModel() {
		var self = this;
		
		self.email = ko.observable("");
		self.pwd = ko.observable("");
		self.pwd1 = ko.observable("");
		self.pwd2 = ko.observable("");

		self.message = ko.observable();
		self.error = ko.observable();
		
		self.setPassword = function() {
			var url = location.href;
			console.log("La ruta actual es ",url);
			url = url.substring(86)
			var info = {
				email : url,
				pwd : self.pwd(),
				pwd1 : self.pwd1(),
				pwd2 : self.pwd2(),
			};
			var data = {
					data : JSON.stringify(info),
					url : "user/setPassword",
					type : "put",
					contentType : 'application/json',
					success : function(response) {
						self.error("");
						self.message("Contraseña cambiada correctamente");
					},
					error : function(response) {
						self.message("");
						self.error(response.responseJSON.errorMessage);
					}
			};
			$.ajax(data);    	  
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
		
		self.connected = function() {
			accUtils.announce('Cambiar Contraseña page loaded.');
			document.title = "Cambio de Contraseña";
			
			var url = location.href;
			console.log("La ruta actual es ",url);
			url = url.substring(86)
			console.log("La ruta nueva es ",url);
			// Implement further logic if needed
		};

		self.disconnected = function() {
			// Implement if needed
		};

		self.transitionCompleted = function() {
			// Implement if needed
		};
	}

	return RegisterViewModel;
});

define([ 'knockout', 'appController', 'ojs/ojmodule-element-utils', 'accUtils',
		'jquery' ], function(ko, app, moduleUtils, accUtils, $) {

		class ProfileViewModel {
		constructor() {
			var self = this;
			self.picture=ko.observable();
			
			// Header Config
			self.headerConfig = ko.observable({
				'view' : [],
				'viewModel' : null
			});
			moduleUtils.createView({
				'viewPath' : 'views/editProfile.html'
			}).then(function(view) {
				self.headerConfig({
					'view' : view,
					'viewModel' : app.getHeaderModel()
				})
			})
			
			self.setPicture = function(widget, event) {
			var file = event.target.files[0];
			var reader = new FileReader();
			reader.onload = function () {
				self.picture ("data:image/png;base64," + btoa(reader.result));
			}
			reader.readAsBinaryString(file);
		}
		
		self.edit = function() {
			var info = {
				email : self.email(),
				picture : self.picture()
			};
			var data = {
					data : JSON.stringify(info),
					url : "user/edit",
					type : "put",
					contentType : 'application/json',
					success : function(response) {
						self.error("");
						self.message("Perfil actualizado");
					},
					error : function(response) {
						self.message("");
						self.error(response.responseJSON.errorMessage);
					}
			};
			$.ajax(data);    	  
		}
		}
}	
});
		
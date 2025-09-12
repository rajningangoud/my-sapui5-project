sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/Device",
  "myapp/myui5project/model/models",
  "myapp/myui5project/model/LoginModel",
  "myapp/myui5project/model/FriendsModel"
], function (UIComponent, Device, models, LoginModel, FriendsModel) {
  "use strict";

  return UIComponent.extend("myapp.myui5project.Component", {
    metadata: {
      manifest: "json"
    },

    init: function () {
      UIComponent.prototype.init.apply(this, arguments);

      this.setModel(models.createDeviceModel(), "device");
      this.setModel(LoginModel.createLoginModel(), "loginModel");
      this.setModel(FriendsModel.createFriendsModel(), "friendsModel");

      // Initialize routing
      this.getRouter().initialize();
    }
  });
});

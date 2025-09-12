sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast"
], function (Controller, MessageToast) {
  "use strict";

  return Controller.extend("myapp.myui5project.controller.MainView", {
    onLogin: function () {
      var oModel = this.getView().getModel("loginModel");
      var sUser = oModel.getProperty("/username");
      var sPass = oModel.getProperty("/password");

      if (sUser === "admin" && sPass === "1234") {
        MessageToast.show("Login successful");
        this.getOwnerComponent().getRouter().navTo("Second");
      } else {
        MessageToast.show("Invalid credentials");
      }
    }
  });
});

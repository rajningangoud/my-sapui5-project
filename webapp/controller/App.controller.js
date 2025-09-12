sap.ui.define([
  "sap/ui/core/mvc/Controller"
], function (Controller) {
  "use strict";

  return Controller.extend("myapp.myui5project.controller.App", {

    onInit: function () {
      console.log("🎯 App Controller initialized");
    },

    onGoToSecond: function () {
      var oRouter = this.getOwnerComponent().getRouter();
      if (oRouter) {
        oRouter.navTo("RouteSecond");
      } else {
        console.warn("Router not found");
      }
    }
  });
});

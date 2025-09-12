sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
  "use strict";
  return {
    createLoginModel: function () {
      return new JSONModel({
        username: "",
        password: ""
      });
    }
  };
});

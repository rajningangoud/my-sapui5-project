sap.ui.define(["sap/ui/model/json/JSONModel"], function (JSONModel) {
  "use strict";
  return {
    createFriendsModel: function () {
      return new JSONModel({
        friends: []   // empty initially, will be filled from backend
      });
    }
  };
});

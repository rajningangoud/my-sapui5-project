sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox",
  "sap/m/Dialog",
  "sap/m/Button",
  "sap/m/Label",
  "sap/m/Input",
  "sap/m/VBox"
], function (
  Controller,
  JSONModel,
  MessageToast,
  MessageBox,
  Dialog,
  Button,
  Label,
  Input,
  VBox
) {
  "use strict";

  return Controller.extend("myapp.myui5project.controller.Second", {

    onInit: function () {
      console.log("🎯 Second Controller initialized");

      this._api = window.location.origin + "/api/friends";

      // Initialize friends model
      var oModel = new JSONModel({ friends: [] });
      this.getView().setModel(oModel, "friendsModel");

      // Load all friends initially
      this.onShowAllFriends();
    },

    // Load all friends from backend
    onShowAllFriends: function () {
      var that = this;
      fetch(this._api)
        .then(res => res.json())
        .then(data => {
          that.getView().getModel("friendsModel").setProperty("/friends", data);
          console.log("📋 Friends loaded:", data);
        })
        .catch(err => {
          console.error("❌ Error loading friends:", err);
          MessageToast.show("Failed to load friends");
        });
    },

    // Open Add Friend dialog
    onAddFriend: function () {
      var oView = this.getView();

      if (!this.oDialog) {
        this.oDialog = new Dialog({
          title: "Add Friend",
          contentWidth: "400px",
          resizable: true,
          draggable: true,
          content: new VBox({
            items: [
              new Label({ text: "Name" }),
              new Input("friendName"),
              new Label({ text: "Education" }),
              new Input("friendEducation"),
              new Label({ text: "City" }),
              new Input("friendCity")
            ]
          }),
          beginButton: new Button({
            text: "Add",
            type: "Emphasized",
            icon: "sap-icon://add",
            press: this._handleAddFriend.bind(this)
          }),
          endButton: new Button({
            text: "Cancel",
            press: function () {
              this.oDialog.close();
            }.bind(this)
          })
        });
        oView.addDependent(this.oDialog);
      }

      // Reset input fields before opening
      sap.ui.getCore().byId("friendName").setValue("");
      sap.ui.getCore().byId("friendEducation").setValue("");
      sap.ui.getCore().byId("friendCity").setValue("");

      this.oDialog.open();
    },

    // Handle adding friend to backend
    _handleAddFriend: function () {
      var name = sap.ui.getCore().byId("friendName").getValue().trim();
      var education = sap.ui.getCore().byId("friendEducation").getValue().trim();
      var city = sap.ui.getCore().byId("friendCity").getValue().trim();

      if (!name || !education || !city) {
        MessageToast.show("All fields are required!");
        return;
      }

      var that = this;
      fetch(this._api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, education, city })
      })
        .then(res => {
          if (!res.ok) throw res;
          return res.json();
        })
        .then(data => {
          MessageToast.show("Friend added: " + data.name);
          that.oDialog.close();
          that.onShowAllFriends();
        })
        .catch(async err => {
          var msg = err.status === 409 ? `Friend '${name}' already exists` : "Failed to add friend";
          MessageToast.show(msg);
          console.error("❌ Error adding friend:", await err.text?.() || err);
        });
    },

    // Delete selected friend
    onDeleteFriend: function () {
      var oTable = this.byId("friendsTable");
      var oSelectedItem = oTable.getSelectedItem();

      if (!oSelectedItem) {
        MessageToast.show("Please select a friend to delete");
        return;
      }

      var oContext = oSelectedItem.getBindingContext("friendsModel");
      var oFriend = oContext.getObject();

      var that = this;
      MessageBox.confirm("Delete '" + oFriend.name + "'?", {
        title: "Confirm",
        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
        onClose: function (sAction) {
          if (sAction === MessageBox.Action.YES) {
            that._deleteFriendByName(oFriend.name);
          }
        }
      });
    },

    // Perform delete by friend name
    _deleteFriendByName: function (name) {
      var that = this;
      fetch(this._api + "/" + encodeURIComponent(name), {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(() => {
          MessageToast.show("Deleted: " + name);
          that.onShowAllFriends();
        })
        .catch(err => {
          console.error("❌ Error deleting friend:", err);
          MessageToast.show("Failed to delete friend");
        });
    },

    // Refresh friends list
    onRefresh: function () {
      this.onShowAllFriends();
    },

    // Enable/disable delete button based on selection
    onSelectionChange: function () {
      var oTable = this.byId("friendsTable");
      var selected = !!oTable.getSelectedItem();
      this.byId("deleteButton").setEnabled(selected);
    },

    // ✅ Logout button
    onLogout: function () {
     
      var oLoginModel = this.getOwnerComponent().getModel("loginModel");
      oLoginModel.setProperty("/username", "");
      oLoginModel.setProperty("/password", "");

      // Navigate back to login
      this.getOwnerComponent().getRouter().navTo("RouteMainView");
    }

  });
});

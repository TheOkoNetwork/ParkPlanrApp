const app = require("@nativescript/core/application");

const SettingsViewModel = require("./settings-view-model");

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new SettingsViewModel();
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView();
  sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
exports.cmsPage = require("../shared/cmsPage");

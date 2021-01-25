const app = require("@nativescript/core/application");

const SignoutExitViewModel = require("./signoutExit-view-model");
const exit = require("nativescript-exit").exit;
function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new SignoutExitViewModel();
}

function onLoaded (args) {
  AuthenticatedPageState();

  setTimeout(() => {
    exit();
  }, 250);
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView();
  sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
const AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;

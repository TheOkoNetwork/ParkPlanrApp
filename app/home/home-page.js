const app = require("tns-core-modules/application");

const HomeViewModel = require("./home-view-model");
const fromObject = require("tns-core-modules/data/observable").fromObject;
function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new HomeViewModel();
}

function onLoaded(args) {
	AuthenticatedPageState();
};

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump")
AuthenticatedPageState = require("../shared/AuthenticatedPageState")
exports.cmsPage = require("../shared/cmsPage")
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;

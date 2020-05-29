const app = require("tns-core-modules/application");

const AboutViewModel = require("./about-view-model");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new AboutViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
exports.cmsPage = require("../shared/cmsPage");

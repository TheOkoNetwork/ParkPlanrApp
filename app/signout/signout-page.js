const app = require("tns-core-modules/application");

const SignoutViewModel = require("./signout-view-model");
const fromObject = require("tns-core-modules/data/observable").fromObject;

const firebase = require("nativescript-plugin-firebase");
const frameModule = require("tns-core-modules/ui/frame");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new SignoutViewModel();
}


function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}
function SignOut(args) {
	console.log("Sign out called");
	firebase.logout();

	setTimeout(function() {
		AuthenticatedPageState();
		setTimeout(function() {
			frameModule.topmost().navigate({
		        moduleName: "home/home-page",
		        transition: {
		            name: "fade"
		        }
		    });
		});
	},250);
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.SignOut = SignOut;
exports.pageJump = require("../shared/pageJump")
AuthenticatedPageState = require("../shared/AuthenticatedPageState")
exports.cmsPage = require("../shared/cmsPage")
exports.AuthenticatedPageState = AuthenticatedPageState;


const observableModule = require("tns-core-modules/data/observable");
const SelectedPageService = require("../shared/selected-page-service");
var appversion = require("nativescript-appversion");

function AboutViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("About");

    const viewModel = observableModule.fromObject({
	versionName: "",
	versionCode: ""
    });

	appversion.getVersionName().then(function(versionName) {
		console.log("Your app's version is: " + versionName);
		viewModel.versionName=versionName;
	});
	appversion.getVersionCode().then(function(versionCode) {
		console.log("Your app's version code is: " + versionCode);
		viewModel.versionCode=versionCode;
	});


    return viewModel;
}

module.exports = AboutViewModel;

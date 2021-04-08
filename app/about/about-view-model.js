const observableModule = require("@nativescript/core/data/observable");
const SelectedPageService = require("../shared/selected-page-service");
const appversion = require("@nativescript/appversion");
const appSettings = require("@nativescript/core/application-settings");
function AboutViewModel () {
  SelectedPageService.getInstance().updateSelectedPage("About");

  const viewModel = observableModule.fromObject({
    versionName: "",
    versionCode: "",
    deploymentID: "Store"
  });

  appversion.getVersionName().then((versionName) => {
    console.log(`Your app's version is: ${versionName}`);
    viewModel.versionName = versionName;
  });
  appversion.getVersionCode().then((versionCode) => {
    console.log(`Your app's version code is: ${versionCode}`);
    viewModel.versionCode = versionCode;
  });

  const appsyncCurrentPackageInfo = JSON.parse(
    appSettings.getString("APPSYNC_CURRENT_PACKAGE", "{}")
  );
  console.log(appsyncCurrentPackageInfo);
  if (appsyncCurrentPackageInfo.label) {
    console.log(`Deployment version: ${appsyncCurrentPackageInfo.label}`);
    viewModel.deploymentID = appsyncCurrentPackageInfo.label;
  }

  return viewModel;
}

module.exports = AboutViewModel;

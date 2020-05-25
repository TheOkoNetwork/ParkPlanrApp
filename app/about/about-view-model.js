const observableModule = require('tns-core-modules/data/observable')
const SelectedPageService = require('../shared/selected-page-service')
const appversion = require('nativescript-appversion')
const appSettings = require("tns-core-modules/application-settings");

function AboutViewModel () {
  SelectedPageService.getInstance().updateSelectedPage('About')

  const viewModel = observableModule.fromObject({
    versionName: '',
    versionCode: '',
    deploymentID: 'App'
  })

  appversion.getVersionName().then(function (versionName) {
    console.log("Your app's version is: " + versionName)
    viewModel.versionName = versionName
  })
  appversion.getVersionCode().then(function (versionCode) {
    console.log("Your app's version code is: " + versionCode)
    viewModel.versionCode = versionCode
  })

    appsyncCurrentPackageInfo = JSON.parse(appSettings.getString("APPSYNC_CURRENT_PACKAGE", "{}"));
//  console.log(AppsyncCurrentPackageInfo);
//  if (AppsyncCurrentPackageInfo.label) {
//    console.log(`Deployment version: ${AppsyncCurrentPackageInfo.label}`);
//    viewModel.DeploymentID = AppsyncCurrentPackageInfo.label;
//  }

  return viewModel
}

module.exports = AboutViewModel

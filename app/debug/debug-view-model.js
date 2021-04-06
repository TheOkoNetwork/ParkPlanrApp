const observableModule = require("@nativescript/core/data/observable");
const SelectedPageService = require("../shared/selected-page-service");
const appversion = require("nativescript-appversion");
const platform = require("@nativescript/core/platform");

const appSettings = require("@nativescript/core/application-settings");

const AuthenticatedStateService = require("../shared/Authenticated-state-service");

function PageViewModel () {
  SelectedPageService.getInstance().updateSelectedPage("Debug");

  const viewModel = observableModule.fromObject({
    versionName: "",
    versionCode: "",
    DeploymentID: "APP",
    user: false,
    lastSubmittedTimestamp: "NONSET",
    lastSubmittedType: "NONSET",
    FCMToken: "Not registered",
    AppID: "",
    platform: ""
  });

  viewModel.platform = platform;

  // viewModel.lastSubmittedTimestamp = JSON.parse(secureStorage.getSync({
  //              key: "pushNotificationTokenLastSubmittedTimestamp"
  //      }));
  //      viewModel.lastSubmittedType = JSON.parse(secureStorage.getSync({
  //              key: "pushNotificationTokenLastSubmittedType"
  //      }));


  appversion.getVersionName().then((versionName) => {
    console.log(`Your app's version is: ${versionName}`);
    viewModel.versionName = versionName;
  });
  appversion.getVersionCode().then((versionCode) => {
    console.log(`Your app's version code is: ${versionCode}`);
    viewModel.versionCode = versionCode;
  });
  appversion.getVersionCode().then((versionCode) => {
    console.log(`Your app's version code is: ${versionCode}`);
    viewModel.versionCode = versionCode;
  });
  appversion.getAppId().then((AppID) => {
    console.log(`Your app's app ID is: ${AppID}`);
    viewModel.AppID = AppID;
  });

  AuthenticatedStateService.getInstance().AuthenticatedState$.subscribe(
    (user) => {
      viewModel.user = user;
    }
  );

  return viewModel;
}

module.exports = PageViewModel;

const app = require("@nativescript/core/application");
const PageViewModel = require("./debug-view-model");
const fromObject = require("@nativescript/core/data/observable").fromObject;

const firebase = require("@nativescript/firebase").firebase;

const appSettings = require("@nativescript/core/application-settings");

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new PageViewModel();

  firebase.getCurrentPushToken().then((FCMToken) => {
    console.log("Got FCMToken");
    const bindingContext = page.bindingContext._map;
    bindingContext.FCMToken = FCMToken;

    const vm = fromObject(bindingContext);
    page.bindingContext = vm;
  });

  console.log("App settings");
  appSettings.getAllKeys().forEach((key) => {
    console.log(key);

    let value = "";
    let type = "*Type unknown*";

    try {
      value = appSettings.getBoolean(key);
      type = "Boolean";
    } catch (error) {}
    try {
      value = appSettings.getNumber(key);
      type = "Number";
    } catch (error) {}
    try {
      value = appSettings.getString(key);
      type = "String";
    } catch (error) {}

    console.log(type, value);
  });
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
exports.cmsPage = require("../shared/cmsPage");

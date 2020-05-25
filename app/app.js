/*
In NativeScript, the app.js file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/
const application = require("tns-core-modules/application");
var firebase = require("nativescript-plugin-firebase");

firebase.init({
  // Optionally pass in properties for database, authentication and cloud messaging,
  // see their respective docs.
}).then(
    function () {
      console.log("firebase.init done");
    },
    function (error) {
      console.log("firebase.init error: " + error);
	alert("Something went wrong, please contact support #FIREFAIL");
    }
);



global.appSyncKeys={
  android: {
    production: "96ZQKTZ73NUzbZA6L5Vipj9ffEusgfbzyisjA",
    staging: "CjVsIwxbUsadcbXTNYsnxbzqMvdjgfbzyisjA"
  },
  ios: {
    production: "xgAx3pieU0VcMjdP2TL1ClOAYVBqgfbzyisjA",
    staging: "wGrs4cnVT3kyyUR0lPF5ga0FveVegfbzyisjA"
  }
};
global.appSyncInit=false;
global.DebugMode=true;

application.run({ moduleName: "app-root/app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/

/*
In NativeScript, the app.js file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/
const application = require("@nativescript/core/application");
const firebase = require("@nativescript/firebase").firebase;
firebase
  .init({
    // Optionally pass in properties for database, authentication and cloud messaging,
    // see their respective docs.
  })
  .then(
    () => {
      console.log("firebase.init done");
    },
    (error) => {
      console.log(`firebase.init error: ${error}`);
    }
  );

global.DebugMode = true;

application.run({ moduleName: "app-root/app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/

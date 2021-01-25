const firebase = require("@nativescript/firebase").firebase;

const config = require("../shared/config");

function SignInGoogle (args) {
  console.log("Sign in with google called");

  const frameModule = require("@nativescript/core/ui/frame");

  const FeedbackPlugin = require("nativescript-feedback");
  const feedback = new FeedbackPlugin.Feedback();
  const color = require("tns-core-modules/color");

  console.log("Attempting sign in with google");

  firebase
    .login({
      type: firebase.LoginType.GOOGLE
    })
    .then((result) => {
      console.log(result);

      setTimeout(() => {
        frameModule.Frame.topmost().navigate({
          moduleName: "home/home-page",
          transition: {
            name: "fade"
          }
        });

        let successMessageTitle;
        if (result.displayName) {
          successMessageTitle = `Welcome ${
                        result.displayName
                    } to ${config("appName")}`;
        } else {
          successMessageTitle = `Welcome to ${config("appName")}`;
        }
        feedback.success({
          title: successMessageTitle,
          titleColor: new color.Color("black")
        });
      }, 125);
    })
    .catch((error) => {
      console.log("Error signing in with google");
      console.log(error);

      const userErrorMessage = "Failed signing in with Google";
      console.log(userErrorMessage);

      setTimeout(() => {
        feedback.error({
          title: userErrorMessage,
          titleColor: new color.Color("black")
        });
      }, 25);
    });
}

module.exports = SignInGoogle;

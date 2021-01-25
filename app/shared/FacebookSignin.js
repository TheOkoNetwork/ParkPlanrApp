const firebase = require("@nativescript/firebase").firebase;
const frameModule = require("@nativescript/core/ui/frame");

const config = require("../shared/config");

function SignInFacebook (args) {
  console.log("Sign in with facebook called");

  const FeedbackPlugin = require("nativescript-feedback");
  const feedback = new FeedbackPlugin.Feedback();
  const color = require("tns-core-modules/color");

  console.log("Attempting sign in with facebook");

  firebase
    .login({
      type: firebase.LoginType.FACEBOOK
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
      console.log("Error signing in with facebook");
      console.log(error);

      if (error === "Facebook Login canceled") {
        setTimeout(() => {
          feedback.error({
            title: "Facebook login cancelled",
            titleColor: new color.Color("black")
          });
        }, 25);

        return;
      }

      let userErrorMessage;
      if (error.nativeException) {
        const errorString = error.nativeException.toString();
        console.log(errorString);
        switch (errorString) {
          case "A valid Facebook app id must be set in the AndroidManifest.xml or set by calling FacebookSdk.setApplicationId before initializing the sdk.":
            userErrorMessage =
                            "Facebook app id not set, please report this error to support";
            break;
          default:
            userErrorMessage =
                            "Error signing in with facebook, please try again";
            break;
        }
      } else {
        const errorCode = error.split(" ")[5].split(":")[0];
        const errorMessage = error.split(":")[1].trim();
        console.log(errorMessage);
        console.log(errorCode);
        switch (errorCode) {
          case "comgoogle.firebase.auth.FirebaseAuthUserCollisionException":
            userErrorMessage =
                            "Looks like you have an account, please sign in using that password/provider";
            break;
          case "com.google.firebase.auth.FirebaseAuthException":
            switch (errorMessage) {
              case "The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section. [ The identity provider configuration is not found. ]":
                userErrorMessage =
                                    "Facebook not enabled in firebase console, please report this error to support";
                break;
              default:
                userErrorMessage =
                                    "Failed to sign in, please try again";
                break;
            }
            break;
          default:
            userErrorMessage =
                            "Failed to sign in, please try again";
        }
      }
      setTimeout(() => {
        feedback.error({
          title: userErrorMessage,
          titleColor: new color.Color("black")
        });
      }, 25);
    });
}

module.exports = SignInFacebook;

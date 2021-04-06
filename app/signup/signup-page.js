const {
  Application,
  Color
} = require('@nativescript/core');

const SignupViewModel = require("./signup-view-model");
const frameModule = require("@nativescript/core/ui/frame");
const config = require("../shared/config");

const firebase = require("@nativescript/firebase").firebase;

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new SignupViewModel();

  page.getViewById("pageTitle").text = `Sign up to ${config("appName")}`;
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}
function SignUpEmail (args) {
  console.log("Sign up with email called");

  const page = frameModule.Frame.topmost().currentPage;

  const FeedbackPlugin = require("nativescript-feedback");
  const feedback = new FeedbackPlugin.Feedback();

  const Email = page.getViewById("Email").text;
  if (!Email) {
    feedback.error({
      title:
                "Please enter your email address or try one of the other sign in options",
      titleColor: new Color("black")
    });

    return;
  }

  const Password = page.getViewById("Password").text;
  if (!Password) {
    feedback.error({
      title: "Please enter your password",
      titleColor: new Color("black")
    });

    return;
  }
  console.log(
        `Attempting sign up with email: ${Email} and provided password.`
  );

  firebase
    .createUser({
      email: Email,
      password: Password
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

        let successFeedbackTitle;
        if (result.displayName) {
          successFeedbackTitle = `Welcome ${
                        result.displayName
                    } to ${config("appName")}`;
        } else {
          successFeedbackTitle = `Welcome to ${config("appName")}`;
        }
        feedback.success({
          title: successFeedbackTitle,
          titleColor: new Color("black")
        });
      }, 125);
    })
    .catch((error) => {
      console.log("Error signing up");
      console.log(error);
      let errorCode;
      let errorMessage;

      if (
        error ===
                "Creating a user failed. Password should be at least 6 characters"
      ) {
        errorMessage = "PASSWORD_SHORT";
      } else {
        errorMessage = error.split(". ")[1].split(":")[0];
        errorMessage = error.split(":")[1].trim();
        console.log(errorMessage);
      }
      console.log(errorMessage);

      setTimeout(() => {
        let userErrorMessage;
        switch (errorCode) {
          case "com.google.firebase.auth.FirebaseAuthInvalidCredentialsException":
            switch (errorMessage) {
              case "The email address is badly formatted.":
                userErrorMessage =
                                    "That email address doesn't look quite right";
                break;
              default:
                userErrorMessage =
                                    "Invalid email address or password";
                break;
            }
            break;
          case "com.google.firebase.auth.FirebaseAuthInvalidUserException":
            switch (errorMessage) {
              case "There is no user record corresponding to this identifier. The user may have been deleted.":
                userErrorMessage =
                                    "Account not found, to sign up just tap sign up";
                break;
              default:
                userErrorMessage =
                                    "Invalid email address or password";
                break;
            }
            break;
          case "com.google.firebase.auth.FirebaseAuthUserCollisionException":
            userErrorMessage =
                            "You already have an account with that email, please sign in";
            break;
          case "PASSWORD_SHORT":
            userErrorMessage = "Your password is too short";
            break;
          default:
            userErrorMessage =
                            "Failed to sign up, please try again";
        }

        console.log(userErrorMessage);

        feedback.error({
          title: userErrorMessage,
          titleColor: new Color("black")
        });
      }, 25);
    });
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.SignUpEmail = SignUpEmail;
exports.pageJump = require("../shared/pageJump");
exports.cmsPage = require("../shared/cmsPage");
exports.SignInGoogle = require("../shared/GoogleSignin");
exports.SignInFacebook = require("../shared/FacebookSignin");

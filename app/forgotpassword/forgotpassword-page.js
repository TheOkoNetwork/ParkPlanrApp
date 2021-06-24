const {
  Application,
  Color
} = require("@nativescript/core");

const ForgotpasswordViewModel = require("./forgotpassword-view-model");
const frameModule = require("@nativescript/core/ui/frame");

const firebase = require("@nativescript/firebase").firebase;

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new ForgotpasswordViewModel();
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}
function ResetPassword (args) {
  console.log("Reset password called");

  const page = frameModule.Frame.topmost().currentPage;

  const FeedbackPlugin = require("nativescript-feedback");
  const feedback = new FeedbackPlugin.Feedback();

  const Email = page.getViewById("Email").text;
  if (!Email) {
    feedback.error({
      title: "Please enter your email address",
      titleColor: new Color("black")
    });

    return;
  }

  firebase
    .sendPasswordResetEmail(Email)
    .then((result) => {
      console.log(result);

      setTimeout(() => {
        feedback.success({
          title: "Sent password reset email",
          message:
                        "Please check your emails for a link to reset your password",
          titleColor: new Color("black")
        });
      }, 25);
    })
    .catch((error) => {
      console.log("Error sending password reset");
      console.log(error);

      setTimeout(() => {
        feedback.error({
          title: "Could not reset password",
          titleColor: new Color("black")
        });
      }, 25);
    });
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.ResetPassword = ResetPassword;
exports.pageJump = require("../shared/pageJump");
exports.cmsPage = require("../shared/cmsPage");

const app = require("tns-core-modules/application");

const ForgotpasswordViewModel = require("./forgotpassword-view-model");
const frameModule = require("tns-core-modules/ui/frame");

const firebase = require("nativescript-plugin-firebase");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new ForgotpasswordViewModel();
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}
function ResetPassword(args) {
    console.log("Reset password called");

    var page = frameModule.topmost().currentPage;

    var FeedbackPlugin = require("nativescript-feedback");
    var feedback = new FeedbackPlugin.Feedback();
    var color = require("color");

    var Email = page.getViewById("Email").text;
    if (!Email) {
        feedback.error({
            title: "Please enter your email address",
            titleColor: new color.Color("black"),
        });
        return;
    }

    firebase
        .sendPasswordResetEmail(Email)
        .then(function (result) {
            console.log(result);

            setTimeout(function () {
                feedback.success({
                    title: "Sent password reset email",
                    message:
                        "Please check your emails for a link to reset your password",
                    titleColor: new color.Color("black"),
                });
            }, 25);
        })
        .catch(function (error) {
            console.log("Error sending password reset");
            console.log(error);

            setTimeout(function () {
                feedback.error({
                    title: "Could not reset password",
                    titleColor: new color.Color("black"),
                });
            }, 25);
        });
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.ResetPassword = ResetPassword;
exports.pageJump = require("../shared/pageJump");
exports.cmsPage = require("../shared/cmsPage");

const app = require("tns-core-modules/application");

const SigninViewModel = require("./signin-view-model");
const fromObject = require("tns-core-modules/data/observable").fromObject;

const LoadingIndicator = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const Mode = require('@nstudio/nativescript-loading-indicator').Mode;
const loader = new LoadingIndicator();
const firebase = require("nativescript-plugin-firebase");

var FeedbackPlugin = require("nativescript-feedback");
var feedback = new FeedbackPlugin.Feedback();

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new SigninViewModel();
}


function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}
function SignInEmail(args) {
	console.log("Sign in with email called");

	frameModule = require("tns-core-modules/ui/frame");
        page=frameModule.topmost().currentPage;

	var FeedbackPlugin = require("nativescript-feedback");
	var feedback = new FeedbackPlugin.Feedback();
	var color = require("color");

        Email=page.getViewById("Email").text;
	if (!Email) {
		alert({
		        title: "Email required",
		        message: "Please enter your email address",
		        okButtonText: "Ok"
		})
		return;
	};

        Password=page.getViewById("Password").text;
	if (!Password) {
		alert({
		        title: "Password required",
		        message: "Please enter your password",
		        okButtonText: "Ok"
		})
		return;
	};
	console.log(`Attempting sign in with email: ${Email} and provided password.`);

	const options = {
	  message: 'Signing in',
	  details: 'Just a sec',
	//  progress: 0.65,
	  margin: 10,
	  dimBackground: true,
	  color: '#4B9ED6', // color of indicator and labels
	  // background box around indicator
	  // hideBezel will override this if true
	 // backgroundColor: 'yellow',
	//  userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
	  hideBezel: true, // default false, can hide the surrounding bezel
	//  mode: Mode.AnnularDeterminate, // see options below
	//  android: {
	//    view: android.view.View, // Target view to show on top of (Defaults to entire window)
	//    cancelable: true,
	//    cancelListener: function(dialog) {
	//      console.log('Loading cancelled');
	//    }
	//  },
	//  ios: {
	//    view: UIView // Target view to show on top of (Defaults to entire window)
	//  }
	};
	loader.show(options);

	firebase.login({
		type: firebase.LoginType.PASSWORD,
        	passwordOptions: {
        		email: Email,
        		password: Password,
	        }
	}).then(function(result) {
		console.log(result);
		loader.hide();

		setTimeout(function() {
			frameModule.topmost().navigate({
	                        moduleName: "home/home-page",
	                        transition: {
	                                name: "fade"
	                        }
	                });

			if (result.displayName) {
				title=`Welcome ${result.displayName} to ParkPlanr`;
			} else {
				title=`Welcome to ParkPlanr`;
			};
			feedback.success({
				title: title,
		 		titleColor: new color.Color("black")
			});
		}, 125);

	}).catch(function(error) {
		console.log("Error signing in");
		console.log(error);
		ErrorCode=error.split(' ')[5].split(':')[0];
		ErrorMessage=error.split(':')[1].trim();
		console.log(ErrorMessage);
		console.log(ErrorCode);
		loader.hide();

		setTimeout(function() {
			switch (ErrorCode) {
				case "com.google.firebase.auth.FirebaseAuthInvalidCredentialsException":
					switch (ErrorMessage) {
						case "The email address is badly formatted.":
							UserErrorMessage="That email address doesn't look quite right";
							break;
						default:
							UserErrorMessage="Invalid email address or password";
							break;
					};
					break;
				case "com.google.firebase.auth.FirebaseAuthInvalidUserException":
					switch (ErrorMessage) {
						case "There is no user record corresponding to this identifier. The user may have been deleted.":
							UserErrorMessage="Account not found, to sign up just tap sign up";
							break;
						default:
							UserErrorMessage="Invalid email address or password";
							break;
					};
					break;
				default:
					UserErrorMessage="Failed to sign in, please try again";
			};

			console.log(UserErrorMessage);

			feedback.error({
				title: UserErrorMessage,
		 		titleColor: new color.Color("black")
			});
		}, 25);
	});
}




function SignInFacebook(args) {
	console.log("Sign in with facebook called");

	frameModule = require("tns-core-modules/ui/frame");
        page=frameModule.topmost().currentPage;

	var FeedbackPlugin = require("nativescript-feedback");
	var feedback = new FeedbackPlugin.Feedback();
	var color = require("color");

	console.log("Attempting sign in with facebook");

	const options = {
	  message: 'Signing in with facebook',
	  details: 'Just a sec',
	//  progress: 0.65,
	  margin: 10,
	  dimBackground: true,
	  color: '#4B9ED6', // color of indicator and labels
	  // background box around indicator
	  // hideBezel will override this if true
	 // backgroundColor: 'yellow',
	//  userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
	  hideBezel: true, // default false, can hide the surrounding bezel
	//  mode: Mode.AnnularDeterminate, // see options below
	//  android: {
	//    view: android.view.View, // Target view to show on top of (Defaults to entire window)
	//    cancelable: true,
	//    cancelListener: function(dialog) {
	//      console.log('Loading cancelled');
	//    }
	//  },
	//  ios: {
	//    view: UIView // Target view to show on top of (Defaults to entire window)
	//  }
	};
	loader.show(options);

	firebase.login({
		type: firebase.LoginType.FACEBOOK
	}).then(function(result) {
		console.log(result);
		loader.hide();

		setTimeout(function() {
			frameModule.topmost().navigate({
	                        moduleName: "home/home-page",
	                        transition: {
	                                name: "fade"
	                        }
	                });

			if (result.displayName) {
				title=`Welcome ${result.displayName} to ParkPlanr`;
			} else {
				title=`Welcome to ParkPlanr`;
			};
			feedback.success({
				title: title,
		 		titleColor: new color.Color("black")
			});
		}, 125);

	}).catch(function(error) {
		console.log("Error signing in with facebook");
		console.log(error);
		loader.hide();

		if (error=="Facebook Login canceled") {
			setTimeout(function() {
				feedback.error({
					title: "Facebook login cancelled",
			 		titleColor: new color.Color("black")
				});
			}, 25);
			return;
		};
		if (error.nativeException) {
			ErrorString=error.nativeException.toString();
			console.log(ErrorString);
			switch (ErrorString) {
				case "A valid Facebook app id must be set in the AndroidManifest.xml or set by calling FacebookSdk.setApplicationId before initializing the sdk.":
					UserErrorMessage="Facebook app id not set, please report this error to support";
					break;
				default:
					UserErrorMessage="Error signing in with facebook, please try again";
					break;
			};
		} else {
			ErrorCode=error.split(' ')[5].split(':')[0];
			ErrorMessage=error.split(':')[1].trim();
			console.log(ErrorMessage);
			console.log(ErrorCode);
			switch (ErrorCode) {
				case "comgoogle.firebase.auth.FirebaseAuthUserCollisionException":
					UserErrorMessage="Looks like you have an account, please sign in using that password/provider";
					break;
				case "com.google.firebase.auth.FirebaseAuthException":
					switch (ErrorMessage) {
						case "The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section. [ The identity provider configuration is not found. ]":
							UserErrorMessage="Facebook not enabled in firebase console, please report this error to support";
							break;
						default:
							UserErrorMessage="Failed to sign in, please try again";
							break;
					};
					break;
				default:
					UserErrorMessage="Failed to sign in, please try again";
			};
		};
		setTimeout(function() {
			feedback.error({
				title: UserErrorMessage,
		 		titleColor: new color.Color("black")
			});
		}, 25);
	});
}


function SignInGoogle(args) {
	console.log("Sign in with google called");

	frameModule = require("tns-core-modules/ui/frame");
        page=frameModule.topmost().currentPage;

	var FeedbackPlugin = require("nativescript-feedback");
	var feedback = new FeedbackPlugin.Feedback();
	var color = require("color");

	console.log("Attempting sign in with google");

	const options = {
	  message: 'Signing in with google',
	  details: 'Just a sec',
	//  progress: 0.65,
	  margin: 10,
	  dimBackground: true,
	  color: '#4B9ED6', // color of indicator and labels
	  // background box around indicator
	  // hideBezel will override this if true
	 // backgroundColor: 'yellow',
	//  userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
	  hideBezel: true, // default false, can hide the surrounding bezel
	//  mode: Mode.AnnularDeterminate, // see options below
	//  android: {
	//    view: android.view.View, // Target view to show on top of (Defaults to entire window)
	//    cancelable: true,
	//    cancelListener: function(dialog) {
	//      console.log('Loading cancelled');
	//    }
	//  },
	//  ios: {
	//    view: UIView // Target view to show on top of (Defaults to entire window)
	//  }
	};
	loader.show(options);

	firebase.login({
		type: firebase.LoginType.GOOGLE
	}).then(function(result) {
		console.log(result);
		loader.hide();

		setTimeout(function() {
			frameModule.topmost().navigate({
	                        moduleName: "home/home-page",
	                        transition: {
	                                name: "fade"
	                        }
	                });

			if (result.displayName) {
				title=`Welcome ${result.displayName} to ParkPlanr`;
			} else {
				title=`Welcome to ParkPlanr`;
			};
			feedback.success({
				title: title,
		 		titleColor: new color.Color("black")
			});
		}, 125);

	}).catch(function(error) {
		console.log("Error signing in with google");
		console.log(error);
		loader.hide();

		UserErrorMessage="Failed signing in with Google";
		setTimeout(function() {
			feedback.error({
				title: UserErrorMessage,
		 		titleColor: new color.Color("black")
			});
		}, 25);
	});
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.SignInEmail = SignInEmail;
exports.SignInFacebook = SignInFacebook;
exports.SignInGoogle = SignInGoogle;
exports.pageJump = require("../shared/pageJump")
exports.cmsPage = require("../shared/cmsPage")

const app = require('tns-core-modules/application')

const SignupViewModel = require('./signup-view-model')
const fromObject = require('tns-core-modules/data/observable').fromObject

const firebase = require('nativescript-plugin-firebase')

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new SignupViewModel()
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView()
  sideDrawer.showDrawer()
}
function SignUpEmail (args) {
  console.log('Sign up with email called')

  frameModule = require('tns-core-modules/ui/frame')
  page = frameModule.topmost().currentPage

  var FeedbackPlugin = require('nativescript-feedback')
  var feedback = new FeedbackPlugin.Feedback()
  var color = require('color')

  Email = page.getViewById('Email').text
  if (!Email) {
    alert({
		        title: 'Email required',
		        message: 'Please enter your email address',
		        okButtonText: 'Ok'
    })
    return
  };

  Password = page.getViewById('Password').text
  if (!Password) {
    alert({
		        title: 'Password required',
		        message: 'Please enter your password',
		        okButtonText: 'Ok'
    })
    return
  };
  console.log(`Attempting sign up with email: ${Email} and provided password.`)

  const options = {
	  message: 'Signing up',
	  details: 'Just a sec',
    //  progress: 0.65,
	  margin: 10,
	  dimBackground: true,
	  color: '#4B9ED6', // color of indicator and labels
	  // background box around indicator
	  // hideBezel will override this if true
	 // backgroundColor: 'yellow',
    //  userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
	  hideBezel: true // default false, can hide the surrounding bezel
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
  }
  // TODO: Fix this
  // loader.show(options);

  firebase.createUser({
    email: Email,
    password: Password
  }).then(function (result) {
    console.log(result)
    // TODO: Fix this
    // loader.hide();

    setTimeout(function () {
      frameModule.topmost().navigate({
        moduleName: 'home/home-page',
        transition: {
          name: 'fade'
        }
      })

      if (result.displayName) {
        title = `Welcome ${result.displayName} to ParkPlanr`
      } else {
        title = 'Welcome to ParkPlanr'
      };
      feedback.success({
        title: title,
        titleColor: new color.Color('black')
      })
    }, 125)
  }).catch(function (error) {
    console.log('Error signing up')
    console.log(error)

    if (error == 'Creating a user failed. Password should be at least 6 characters') {
      ErrorCode = 'PASSWORD_SHORT'
    } else {
      ErrorCode = error.split('. ')[1].split(':')[0]
      ErrorMessage = error.split(':')[1].trim()
      console.log(ErrorMessage)
    };
    console.log(ErrorCode)
    // TODO: Fix this
    // loader.hide();

    setTimeout(function () {
      switch (ErrorCode) {
        case 'com.google.firebase.auth.FirebaseAuthInvalidCredentialsException':
          switch (ErrorMessage) {
            case 'The email address is badly formatted.':
              UserErrorMessage = "That email address doesn't look quite right"
              break
            default:
              UserErrorMessage = 'Invalid email address or password'
              break
          };
          break
        case 'com.google.firebase.auth.FirebaseAuthInvalidUserException':
          switch (ErrorMessage) {
            case 'There is no user record corresponding to this identifier. The user may have been deleted.':
              UserErrorMessage = 'Account not found, to sign up just tap sign up'
              break
            default:
              UserErrorMessage = 'Invalid email address or password'
              break
          };
          break
        case 'com.google.firebase.auth.FirebaseAuthUserCollisionException':
          UserErrorMessage = 'You already have an account with that email, please sign in'
          break
        case 'PASSWORD_SHORT':
          UserErrorMessage = 'Your password is too short'
          break
        default:
          UserErrorMessage = 'Failed to sign up, please try again'
      };

      console.log(UserErrorMessage)

      feedback.error({
        title: UserErrorMessage,
		 		titleColor: new color.Color('black')
      })
    }, 25)
  })
}

exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
exports.SignUpEmail = SignUpEmail
exports.pageJump = require('../shared/pageJump')
exports.cmsPage = require('../shared/cmsPage')
exports.SignInGoogle = require('../shared/GoogleSignin')
exports.SignInFacebook = require('../shared/FacebookSignin')

const app = require('tns-core-modules/application')

const SigninViewModel = require('./signin-view-model')
const fromObject = require('tns-core-modules/data/observable').fromObject

const firebase = require('nativescript-plugin-firebase')

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new SigninViewModel()
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView()
  sideDrawer.showDrawer()
}
function SignInEmail (args) {
  console.log('Sign in with email called')

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
  console.log(`Attempting sign in with email: ${Email} and provided password.`)

  firebase.login({
    type: firebase.LoginType.PASSWORD,
        	passwordOptions: {
        		email: Email,
        		password: Password
	        }
  }).then(function (result) {
    console.log(result)

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
    console.log('Error signing in')
    console.log(error)
    ErrorCode = error.split(' ')[5].split(':')[0]
    ErrorMessage = error.split(':')[1].trim()
    console.log(ErrorMessage)
    console.log(ErrorCode)

//    alert(ErrorCode)

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
        default:
          UserErrorMessage = 'Failed to sign in, please try again'
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
exports.SignInEmail = SignInEmail
exports.SignInGoogle = require('../shared/GoogleSignin')
exports.SignInFacebook = require('../shared/FacebookSignin')
exports.pageJump = require('../shared/pageJump')
exports.cmsPage = require('../shared/cmsPage')

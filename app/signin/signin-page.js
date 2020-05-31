const app = require('tns-core-modules/application')

const SigninViewModel = require('./signin-view-model')
const frameModule = require('tns-core-modules/ui/frame')
const config = require('../shared/config')

const firebase = require('nativescript-plugin-firebase')

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new SigninViewModel()

  page.getViewById('pageTitle').text = `Sign in to ${config('appName')}`
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView()
  sideDrawer.showDrawer()
}
function SignInEmail (args) {
  console.log('Sign in with email called')

  var page = frameModule.topmost().currentPage

  var FeedbackPlugin = require('nativescript-feedback')
  var feedback = new FeedbackPlugin.Feedback()
  var color = require('color')

  var Email = page.getViewById('Email').text
  if (!Email) {
    feedback.error({
      title:
                'Please enter your email address or try one of the other sign in options',
      titleColor: new color.Color('black')
    })
    return
  }

  var Password = page.getViewById('Password').text
  if (!Password) {
    feedback.error({
      title: 'Please enter your password',
      titleColor: new color.Color('black')
    })
    return
  }

  console.log(
        `Attempting sign in with email: ${Email} and provided password.`
  )

  firebase
    .login({
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {
        email: Email,
        password: Password
      }
    })
    .then(function (result) {
      console.log(result)

      setTimeout(function () {
        frameModule.topmost().navigate({
          moduleName: 'home/home-page',
          transition: {
            name: 'fade'
          }
        })

        var successMessageTitle
        if (result.displayName) {
          successMessageTitle = `Welcome ${
                        result.displayName
                    } to ${config('appName')}`
        } else {
          successMessageTitle = `Welcome to ${config('appName')}`
        }
        feedback.success({
          title: successMessageTitle,
          titleColor: new color.Color('black')
        })
      }, 125)
    })
    .catch(function (error) {
      console.log('Error signing in')
      console.log(error)
      var errorCode = error.split(' ')[5].split(':')[0]
      var errorMessage = error.split(':')[1].trim()
      console.log(errorMessage)
      console.log(errorCode)

      setTimeout(function () {
        var userErrorMessage
        switch (errorCode) {
          case 'com.google.firebase.auth.FirebaseAuthInvalidCredentialsException':
            switch (errorMessage) {
              case 'The email address is badly formatted.':
                userErrorMessage =
                                    "That email address doesn't look quite right"
                break
              default:
                userErrorMessage =
                                    'Invalid email address or password'
                break
            }
            break
          case 'com.google.firebase.auth.FirebaseAuthInvalidUserException':
            switch (errorMessage) {
              case 'There is no user record corresponding to this identifier. The user may have been deleted.':
                userErrorMessage =
                                    'Account not found, to sign up just tap sign up'
                break
              default:
                userErrorMessage =
                                    'Invalid email address or password'
                break
            }
            break
          default:
            userErrorMessage =
                            'Failed to sign in, please try again'
        }

        console.log(userErrorMessage)

        feedback.error({
          title: userErrorMessage,
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

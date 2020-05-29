const app = require('tns-core-modules/application')

const fromObject = require('tns-core-modules/data/observable').fromObject

const firebase = require('nativescript-plugin-firebase')

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()

const config = require('../shared/config')

function SignInFacebook (args) {
  console.log('Sign in with facebook called')

  frameModule = require('tns-core-modules/ui/frame')
  page = frameModule.topmost().currentPage

  var FeedbackPlugin = require('nativescript-feedback')
  var feedback = new FeedbackPlugin.Feedback()
  var color = require('color')

  console.log('Attempting sign in with facebook')

  firebase
    .login({
      type: firebase.LoginType.FACEBOOK
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

        if (result.displayName) {
          title = `Welcome ${result.displayName} to ${config(
                        'appName'
                    )}`
        } else {
          title = `Welcome to ${config('appName')}`
        }
        feedback.success({
          title: title,
          titleColor: new color.Color('black')
        })
      }, 125)
    })
    .catch(function (error) {
      console.log('Error signing in with facebook')
      console.log(error)

      if (error == 'Facebook Login canceled') {
        setTimeout(function () {
          feedback.error({
            title: 'Facebook login cancelled',
            titleColor: new color.Color('black')
          })
        }, 25)
        return
      }
      if (error.nativeException) {
        ErrorString = error.nativeException.toString()
        console.log(ErrorString)
        switch (ErrorString) {
          case 'A valid Facebook app id must be set in the AndroidManifest.xml or set by calling FacebookSdk.setApplicationId before initializing the sdk.':
            UserErrorMessage =
                            'Facebook app id not set, please report this error to support'
            break
          default:
            UserErrorMessage =
                            'Error signing in with facebook, please try again'
            break
        }
      } else {
        ErrorCode = error.split(' ')[5].split(':')[0]
        ErrorMessage = error.split(':')[1].trim()
        console.log(ErrorMessage)
        console.log(ErrorCode)
        switch (ErrorCode) {
          case 'comgoogle.firebase.auth.FirebaseAuthUserCollisionException':
            UserErrorMessage =
                            'Looks like you have an account, please sign in using that password/provider'
            break
          case 'com.google.firebase.auth.FirebaseAuthException':
            switch (ErrorMessage) {
              case 'The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section. [ The identity provider configuration is not found. ]':
                UserErrorMessage =
                                    'Facebook not enabled in firebase console, please report this error to support'
                break
              default:
                UserErrorMessage =
                                    'Failed to sign in, please try again'
                break
            }
            break
          default:
            UserErrorMessage =
                            'Failed to sign in, please try again'
        }
      }
      setTimeout(function () {
        feedback.error({
          title: UserErrorMessage,
          titleColor: new color.Color('black')
        })
      }, 25)
    })
}

module.exports = SignInFacebook

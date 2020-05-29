const firebase = require('nativescript-plugin-firebase')
const frameModule = require('tns-core-modules/ui/frame')

const config = require('../shared/config')

function SignInFacebook (args) {
  console.log('Sign in with facebook called')

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
      console.log('Error signing in with facebook')
      console.log(error)

      if (error === 'Facebook Login canceled') {
        setTimeout(function () {
          feedback.error({
            title: 'Facebook login cancelled',
            titleColor: new color.Color('black')
          })
        }, 25)
        return
      }

      var userErrorMessage
      if (error.nativeException) {
        var errorString = error.nativeException.toString()
        console.log(errorString)
        switch (errorString) {
          case 'A valid Facebook app id must be set in the AndroidManifest.xml or set by calling FacebookSdk.setApplicationId before initializing the sdk.':
            userErrorMessage =
                            'Facebook app id not set, please report this error to support'
            break
          default:
            userErrorMessage =
                            'Error signing in with facebook, please try again'
            break
        }
      } else {
        var errorCode = error.split(' ')[5].split(':')[0]
        var errorMessage = error.split(':')[1].trim()
        console.log(errorMessage)
        console.log(errorCode)
        switch (errorCode) {
          case 'comgoogle.firebase.auth.FirebaseAuthUserCollisionException':
            userErrorMessage =
                            'Looks like you have an account, please sign in using that password/provider'
            break
          case 'com.google.firebase.auth.FirebaseAuthException':
            switch (errorMessage) {
              case 'The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section. [ The identity provider configuration is not found. ]':
                userErrorMessage =
                                    'Facebook not enabled in firebase console, please report this error to support'
                break
              default:
                userErrorMessage =
                                    'Failed to sign in, please try again'
                break
            }
            break
          default:
            userErrorMessage =
                            'Failed to sign in, please try again'
        }
      }
      setTimeout(function () {
        feedback.error({
          title: userErrorMessage,
          titleColor: new color.Color('black')
        })
      }, 25)
    })
}

module.exports = SignInFacebook

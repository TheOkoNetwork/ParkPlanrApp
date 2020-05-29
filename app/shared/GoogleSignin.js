const firebase = require('nativescript-plugin-firebase')

const config = require('../shared/config')

function SignInGoogle (args) {
  console.log('Sign in with google called')

  var frameModule = require('tns-core-modules/ui/frame')

  var FeedbackPlugin = require('nativescript-feedback')
  var feedback = new FeedbackPlugin.Feedback()
  var color = require('color')

  console.log('Attempting sign in with google')

  firebase
    .login({
      type: firebase.LoginType.GOOGLE
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
          successMessageTitle = `Welcome ${result.displayName} to ${config(
                        'appName'
                    )}`
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
      console.log('Error signing in with google')
      console.log(error)

      var userErrorMessage = 'Failed signing in with Google'
      console.log(userErrorMessage)

      setTimeout(function () {
        feedback.error({
          title: userErrorMessage,
          titleColor: new color.Color('black')
        })
      }, 25)
    })
}

module.exports = SignInGoogle

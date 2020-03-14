const app = require('tns-core-modules/application')

const ForgotpasswordViewModel = require('./forgotpassword-view-model')
const fromObject = require('tns-core-modules/data/observable').fromObject

const firebase = require('nativescript-plugin-firebase')

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new ForgotpasswordViewModel()
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView()
  sideDrawer.showDrawer()
}
function ResetPassword (args) {
  console.log('Reset password called')

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

  const options = {
	  message: 'Sending password reset',
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

  firebase.sendPasswordResetEmail(Email).then(function (result) {
    console.log(result)

    setTimeout(function () {
      feedback.success({
        title: 'Sent password reset email',
        message: 'Please check your emails for a link to reset your password',
		 		titleColor: new color.Color('black')
      })
    }, 25)
  }).catch(function (error) {
    console.log('Error sending password reset')
    console.log(error)

    setTimeout(function () {
      feedback.error({
        title: 'Could not reset password',
		 		titleColor: new color.Color('black')
      })
    }, 25)
  })
}

exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
exports.ResetPassword = ResetPassword
exports.pageJump = require('../shared/pageJump')
exports.cmsPage = require('../shared/cmsPage')

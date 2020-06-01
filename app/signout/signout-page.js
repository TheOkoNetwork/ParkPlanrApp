const app = require('tns-core-modules/application')

const SignoutViewModel = require('./signout-view-model')

const firebaseApp = require('nativescript-plugin-firebase/app')
firebaseApp.initializeApp()
const firebase = require('nativescript-plugin-firebase')

const frameModule = require('tns-core-modules/ui/frame')
const config = require('../shared/config')

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()
var color = require('color')

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new SignoutViewModel()

  page.getViewById('pageTitle').text = `Sign out of ${config('appName')}`
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView()
  sideDrawer.showDrawer()
}
async function SignOut (args) {
  console.log('Sign out called')
  firebase.logout()
  firebaseApp
    .auth()
    .signOut()
    .then(function () {
      console.log('firebaseApp signOut')

      firebase
        .reloadUser()
        .then(function () {
          AuthenticatedPageState()

          setTimeout(function () {
            frameModule.topmost().navigate({
              moduleName: 'home/home-page',
              transition: {
                name: 'fade'
              }
            })
          }, 500)
        })
        .catch(function (error) {
          if (error) {
            console.log('Error reloading user after signing out')
            console.log(error)
            feedback.error({
              title: JSON.stringify(error),
              titleColor: new color.Color('black')
            })
          }
        })
    })

    .catch(function (error) {
      if (error) {
        console.log('Error signing out')
        console.log(error)
      }
    })
}

exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
exports.SignOut = SignOut
exports.pageJump = require('../shared/pageJump')
var AuthenticatedPageState = require('../shared/AuthenticatedPageState')
exports.cmsPage = require('../shared/cmsPage')
exports.AuthenticatedPageState = AuthenticatedPageState

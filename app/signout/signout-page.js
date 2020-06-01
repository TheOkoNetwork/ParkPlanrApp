const app = require('tns-core-modules/application')

const SignoutViewModel = require('./signout-view-model')

const firebaseApp = require('nativescript-plugin-firebase/app')
firebaseApp.initializeApp()
const firebase = require('nativescript-plugin-firebase')
const exit = require('nativescript-exit').exit

const config = require('../shared/config')

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

      AuthenticatedPageState()
      exit()
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

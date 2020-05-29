const app = require('tns-core-modules/application')

const SignoutViewModel = require('./signout-view-model')


const firebaseApp = require('nativescript-plugin-firebase/app')
firebaseApp.initializeApp()

const frameModule = require('tns-core-modules/ui/frame')

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new SignoutViewModel()
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView()
  sideDrawer.showDrawer()
}
async function SignOut (args) {
  console.log('Sign out called')
  
  firebaseWebApi.auth().signOut().then(function() {
    console.log("Logout OK")
    AuthenticatedPageState()
    setTimeout(function () {
      frameModule.topmost().navigate({
        moduleName: 'home/home-page',
        transition: {
          name: 'fade'
        }
      })
    })
  }).catch(function(error) {
    if (error) {
      console.log("Error signing out")
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

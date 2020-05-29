const app = require('tns-core-modules/application')

const SignoutViewModel = require('./signout-view-model')

const firebase = require('nativescript-plugin-firebase')
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
  await firebase.logout()

  setTimeout(function () {
    AuthenticatedPageState()
    setTimeout(function () {
      frameModule.topmost().navigate({
        moduleName: 'home/home-page',
        transition: {
          name: 'fade'
        }
      })
    })
  }, 250)
}

exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
exports.SignOut = SignOut
exports.pageJump = require('../shared/pageJump')
var AuthenticatedPageState = require('../shared/AuthenticatedPageState')
exports.cmsPage = require('../shared/cmsPage')
exports.AuthenticatedPageState = AuthenticatedPageState

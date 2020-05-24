const app = require('tns-core-modules/application')
const Observable = require('tns-core-modules/data/observable').Observable

const MapsParkViewModel = require('./mapsPark-view-model')
const fromObject = require('tns-core-modules/data/observable').fromObject

const firebaseApp = require('nativescript-plugin-firebase/app')
firebaseApp.initializeApp()

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()
var color = require('color')

const Cache = require('tns-core-modules/ui/image-cache').Cache

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new MapsParkViewModel()

  parkId = page.navigationContext.parkId
  console.log(`Loading map for park: ${parkId}`)

  console.log('Fetching park data')
  firebaseApp.firestore().collection('parks').doc(parkId).get().then(function (parkSnapshot) {
    console.log('park data')
    mapUrl = parkSnapshot.data().map
    const vm = fromObject({
      mapUrl: mapUrl,
      parkName: parkSnapshot.data().name
    })
    alert(mapUrl)
    page.bindingContext = vm
  }).catch(function (error) {
    console.log(`Error fetching map for park: ${parkId}`)
    console.log(error)

    frameModule.topmost().navigate({
      moduleName: 'home/home-page',
      transition: {
        name: 'fade'
      }
    })
    setTimeout(function () {
      feedback.error({
        title: 'Unable to load map',
        message: 'Please check your internet connection and try again',
        titleColor: new color.Color('black')
      })
    }, 125)
  })
}

function onLoaded (args) {
  frameModule = require('tns-core-modules/ui/frame')
  page = frameModule.topmost().currentPage
};

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView()
  sideDrawer.showDrawer()
}

exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
exports.pageJump = require('../shared/pageJump')
AuthenticatedPageState = require('../shared/AuthenticatedPageState')
exports.cmsPage = require('../shared/cmsPage')
exports.AuthenticatedPageState = AuthenticatedPageState
exports.onLoaded = onLoaded

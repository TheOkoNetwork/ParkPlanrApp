const app = require('tns-core-modules/application')

const RidecountDeleteViewModel = require('./ridecountDelete-view-model')
const fromObject = require('tns-core-modules/data/observable').fromObject

const firebaseApp = require('nativescript-plugin-firebase/app')
firebaseApp.initializeApp()

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()

frameModule = require('tns-core-modules/ui/frame')
var color = require('color')

const moment = require('moment')

function onNavigatingTo (args) {
  page = args.object
  page.bindingContext = new RidecountDeleteViewModel()

  tripId = page.navigationContext.tripId
  parkId = page.navigationContext.parkId
  userId = page.bindingContext.user.uid

  console.log(`Loading ridecount delete confirmation for trip: ${tripId} to: ${parkId} for user: ${userId}`)

  getPromises = [
    firebaseApp.firestore().collection('users').doc(userId).collection('ridecount').doc(tripId).get(),
    firebaseApp.firestore().collection('parks').doc(parkId).get()
  ]

  Promise.all(getPromises).then(function (promiseResults) {
    pageContext = {
      user: page.bindingContext.user,
      parkId: parkId
    }
    promiseResults.forEach(function (promiseResult) {
      if (promiseResult.id) {
        console.log('Document')
        switch (promiseResult.ref.path.split('/')[0]) {
          case 'users':
            console.log('Trip doc')
            trip = promiseResult.data()
            trip.id = promiseResult.id
            trip.dateHuman = moment(trip.date).format('dddd DD/MM/YYYY')
            pageContext.trip = trip
            break
          case 'parks':
            console.log('Park doc')
            park = promiseResult.data()
            park.id = promiseResult.id
            pageContext.park = park
            break
          default:
            console.log('Unknown first fragment')
            console.log(promiseResult.ref.path)
        };
      } else {
        console.log('Collection')
        promiseResult.forEach(function (doc) {
          console.log(doc)
          switch (doc.ref.path.split('/')[0]) {
            default:
              console.log('Unknown first fragment')
              console.log(doc.ref.path)
          };
        })
      };
    })
    pageContext.pageTitle = `Deleting trip\n${pageContext.park.name}\n${pageContext.trip.dateHuman}`
    console.log(pageContext)
    const vm = fromObject(pageContext)
    page.bindingContext = vm
  }).catch(function (error) {
    console.log('Ride count get error')
    console.log(error)

    frameModule.topmost().navigate({
      moduleName: 'ridecount/ridecount-page',
      backstackVisible: false,
      transition: {
        name: 'fade'
      }
    })
    setTimeout(function () {
      feedback.error({
        title: 'Unable to load ride count',
        message: 'Please check your internet connection and try again',
        titleColor: new color.Color('black')
      })
    }, 125)
  })
}

function onLoaded (args) {
  AuthenticatedPageState()
};

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView()
  sideDrawer.showDrawer()
}

function returnToRidecount () {
  console.log('Cancelling, returning to ride count')
  var frame = require('ui/frame')
  frameModule.topmost().navigate({
    moduleName: 'ridecount/ridecount-page',
    backstackVisible: false,
    transition: {
                	name: 'fade'
    },
    context: {
                	tripId: tripId,
        	        parkId: parkId
	        }
  })
}
function deleteRidecount () {
  var frame = require('ui/frame')
  var page = frame.topmost().currentPage
  Count = page.bindingContext.AddEditCount
  userId = page.bindingContext.user.uid
  parkId = page.bindingContext.parkId
  tripId = page.bindingContext.trip.id

  console.log(`Deleting trip: ${tripId} for user: ${userId}`)
  firebaseApp.firestore().collection('users').doc(userId).collection('ridecount').doc(tripId).delete().then(function () {
    console.log('Server confirmed ride count delete')
  }).catch(function (error) {
    console.log('Ride count delete error')
    console.log(error)
    setTimeout(function () {
      feedback.error({
        title: 'Unable to delete ride count',
        message: 'Please check your internet connection and try again',
        titleColor: new color.Color('black')
      })
    }, 130)
  })
  console.log('Assuming delete succeeded, switching to ride count list')
  frameModule.topmost().navigate({
    moduleName: 'ridecount/ridecount-page',
    backstackVisible: false,
    transition: {
                	name: 'fade'
    },
    context: {
                	tripId: tripId,
        	        parkId: parkId
	        }
  })
  setTimeout(function () {
    feedback.success({
      title: 'Deleted count',
      message: 'Ride count deleted',
      titleColor: new color.Color('black')
    })
  }, 125)
};

exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
exports.pageJump = require('../shared/pageJump')
AuthenticatedPageState = require('../shared/AuthenticatedPageState')
exports.cmsPage = require('../shared/cmsPage')
exports.AuthenticatedPageState = AuthenticatedPageState
exports.onLoaded = onLoaded
exports.returnToRidecount = returnToRidecount
exports.deleteRidecount = deleteRidecount

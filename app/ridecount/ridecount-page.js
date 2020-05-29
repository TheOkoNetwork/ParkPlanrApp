const app = require('tns-core-modules/application')

const RidecountViewModel = require('./ridecount-view-model')
const fromObject = require('tns-core-modules/data/observable').fromObject

const firebaseApp = require('nativescript-plugin-firebase/app')
firebaseApp.initializeApp()

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()

frameModule = require('tns-core-modules/ui/frame')
var color = require('color')

const moment = require('moment')

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new RidecountViewModel()

  userId = page.bindingContext.user.uid
  tripDataPromises = [
    firebaseApp
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('ridecount')
      .orderBy('date', 'desc')
      .get(),
    firebaseApp
      .firestore()
      .collection('parks')
      .where('active', '==', true)
      .get()
  ]
  Promise.all(tripDataPromises)
    .then((promiseResults) => {
      parks = {}
      trips = []
      promiseResults.forEach(function (promiseResult) {
        promiseResult.forEach(function (doc) {
          parentCollection = doc.ref.path.split('/')[0]
          switch (parentCollection) {
            case 'parks':
              parks[doc.id] = doc.data()
              parks[doc.id].id = doc.id
              break
            case 'users':
              trip = doc.data()
              trip.humanDate = moment(doc.data().date).format(
                'dddd DD/MM/YYYY'
              )
              trip.id = doc.id
              trips.push(trip)
              break
            default:
              console.log(
                                `Unknown parent collection: ${parentCollection}`
              )
          }
        })
      })
      trips.forEach(function (trip, tripIndex) {
        trips[tripIndex].park = parks[trip.park]
      })
      console.log(trips)
      const vm = fromObject({
        trips: trips
      })
      page.bindingContext = vm
    })
    .catch(function (error) {
      console.log('Error fetching trips')
      console.log(error)
      frameModule.topmost().navigate({
        moduleName: 'home/home-page',
        transition: {
          name: 'fade'
        }
      })

      setTimeout(function () {
        feedback.error({
          title: 'Unable to load trip',
          message:
                        'Please check your internet connection and try again',
          titleColor: new color.Color('black')
        })
      }, 125)
    })
}

function onTripSelect (args) {
  tripId = args.view.tripId
  parkId = args.view.parkId
  console.log(`Switching to trip: ${tripId} park: ${parkId}`)
  frameModule.topmost().navigate({
    moduleName: 'ridecountCount/ridecountCount-page',
    transition: {
      name: 'fade'
    },
    context: {
      tripId: tripId,
      parkId: parkId
    }
  })
}

function onTripLongSelect (args) {
  tripId = args.view.tripId
  parkId = args.view.parkId
  console.log(
        `Switching to delete confirm for trip: ${tripId} park: ${parkId}`
  )

  frameModule.topmost().navigate({
    moduleName: 'ridecountDelete/ridecountDelete-page',
    transition: {
      name: 'fade'
    },
    context: {
      tripId: tripId,
      parkId: parkId
    }
  })
}

function onLoaded (args) {
  AuthenticatedPageState()
}

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
exports.onTripSelect = onTripSelect
exports.onTripLongSelect = onTripLongSelect

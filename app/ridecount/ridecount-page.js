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

  UserId = page.bindingContext.user.uid
  TripDataPromises = [
	        firebaseApp.firestore().collection('Users').doc(UserId).collection('RideCount').orderBy('Date', 'desc').get(),
	        firebaseApp.firestore().collection('Parks').get()
  ]
  Promise.all(TripDataPromises).then(PromiseResults => {
    Parks = {}
    Trips = []
    PromiseResults.forEach(function (PromiseResult) {
      PromiseResult.forEach(function (Doc) {
        ParentCollection = Doc.ref.path.split('/')[0]
        switch (ParentCollection) {
          case 'Parks':
            Parks[Doc.id] = Doc.data()
            Parks[Doc.id].id = Doc.id
            break
          case 'Users':
            Trip = Doc.data()
            Trip.HumanDate = moment(Doc.data().Date).format('dddd DD/MM/YYYY')
            Trip.id = Doc.id
            Trips.push(Trip)
            break
          default:
            console.log(`Unknown parent collection: ${ParentCollection}`)
        };
      })
    })
    Trips.forEach(function (Trip, TripIndex) {
      Trips[TripIndex].Park = Parks[Trip.Park]
    })
    console.log(Trips)
    const vm = fromObject({
      Trips: Trips
    })
    page.bindingContext = vm
  }).catch(function (error) {
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
        message: 'Please check your internet connection and try again',
        titleColor: new color.Color('black')
      })
    }, 125)
  })
}

function onTripSelect (args) {
  TripId = args.view.TripId
  ParkId = args.view.ParkId
  console.log(`Switching to trip: ${TripId} park: ${ParkId}`)
  frameModule.topmost().navigate({
    moduleName: 'ridecountCount/ridecountCount-page',
    transition: {
      name: 'fade'
    },
    context: {
      TripId: TripId,
      ParkId: ParkId
    }
  })
};

function onTripLongSelect (args) {
  TripId = args.view.TripId
  ParkId = args.view.ParkId
  console.log(`Switching to delete confirm for trip: ${TripId} park: ${ParkId}`)

  frameModule.topmost().navigate({
    moduleName: 'ridecountDelete/ridecountDelete-page',
    transition: {
      name: 'fade'
    },
    context: {
      TripId: TripId,
      ParkId: ParkId
    }
  })
};

function onLoaded (args) {
  AuthenticatedPageState()
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
exports.onTripSelect = onTripSelect
exports.onTripLongSelect = onTripLongSelect

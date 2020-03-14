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

  TripId = page.navigationContext.TripId
  ParkId = page.navigationContext.ParkId
  UserId = page.bindingContext.user.uid

  console.log(`Loading ridecount delete confirmation for trip: ${TripId} to: ${ParkId} for user: ${UserId}`)

  GetPromises = [
    firebaseApp.firestore().collection('Users').doc(UserId).collection('RideCount').doc(TripId).get(),
    firebaseApp.firestore().collection('Parks').doc(ParkId).get()
  ]

  Promise.all(GetPromises).then(function (PromiseResults) {
    PageContext = {
      user: page.bindingContext.user,
      ParkId: ParkId
    }
    PromiseResults.forEach(function (PromiseResult) {
      if (PromiseResult.id) {
        console.log('Document')
        switch (PromiseResult.ref.path.split('/')[0]) {
          case 'Users':
            console.log('Trip doc')
            Trip = PromiseResult.data()
            Trip.Id = PromiseResult.id
            Trip.DateHuman = moment().format('dddd DD/MM/YYYY')
            PageContext.Trip = Trip
            break
          case 'Parks':
            console.log('Park doc')
            Park = PromiseResult.data()
            Park.Id = PromiseResult.id
            PageContext.Park = Park
            break
          default:
            console.log('Unknown first fragment')
            console.log(PromiseResult.ref.path)
        };
      } else {
        console.log('Collection')
        PromiseResult.forEach(function (Doc) {
          console.log(Doc)
          switch (Doc.ref.path.split('/')[0]) {
            default:
              console.log('Unknown first fragment')
              console.log(Doc.ref.path)
          };
        })
      };
    })
    PageContext.PageTitle = `Deleting trip\n${PageContext.Park.Name}\n${PageContext.Trip.DateHuman}`
    console.log(PageContext)
    const vm = fromObject(PageContext)
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

function ReturnToRidecount () {
  console.log('Cancelling, returning to ride count')
  var frame = require('ui/frame')
  frameModule.topmost().navigate({
    moduleName: 'ridecount/ridecount-page',
    backstackVisible: false,
    transition: {
                	name: 'fade'
    },
    context: {
                	TripId: TripId,
        	        ParkId: ParkId
	        }
  })
}
function DeleteRidecount () {
  var frame = require('ui/frame')
  var page = frame.topmost().currentPage
  Count = page.bindingContext.AddEditCount
  UserId = page.bindingContext.user.uid
  ParkId = page.bindingContext.ParkId
  TripId = page.bindingContext.Trip.Id

  console.log(`Deleting trip trip: ${TripId} for user: ${UserId}`)
  firebaseApp.firestore().collection('Users').doc(UserId).collection('RideCount').doc(TripId).delete().then(function () {
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
                	TripId: TripId,
        	        ParkId: ParkId
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
exports.ReturnToRidecount = ReturnToRidecount
exports.DeleteRidecount = DeleteRidecount

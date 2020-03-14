const app = require('tns-core-modules/application')

const RidecountCountViewModel = require('./ridecountCount-view-model')
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
  page.bindingContext = new RidecountCountViewModel()

  TripId = page.navigationContext.TripId
  ParkId = page.navigationContext.ParkId
  UserId = page.bindingContext.user.uid

  console.log(`Loading trip: ${TripId} to: ${ParkId} for user: ${UserId}`)

  GetPromises = [
    firebaseApp.firestore().collection('Users').doc(UserId).collection('RideCount').doc(TripId).get(),
    firebaseApp.firestore().collection('Users').doc(UserId).collection('RideCount').doc(TripId).collection('Rides').get(),
    firebaseApp.firestore().collection('Parks').doc(ParkId).get(),
    firebaseApp.firestore().collection('Parks').doc(ParkId).collection('Rides').orderBy('Name', 'asc').get()
  ]

  Promise.all(GetPromises).then(function (PromiseResults) {
    RideCounts = {}
    PageContext = {
      Rides: []
    }
    PromiseResults.forEach(function (PromiseResult) {
      if (PromiseResult.id) {
        console.log('Document')
        switch (PromiseResult.ref.path.split('/')[0]) {
          case 'Parks':
            console.log('Park doc')
            Park = PromiseResult.data()
            Park.Id = PromiseResult.id
            PageContext.Park = Park
            break
          case 'Users':
            console.log('Trip doc')
            Trip = PromiseResult.data()
            Trip.Id = PromiseResult.id
            Trip.DateHuman = moment().format('dddd DD/MM/YYYY')
            PageContext.Trip = Trip
            break
          default:
            console.log('Unknown first fragment')
            console.log(PromiseResult.ref.path)
        };
      } else {
        console.log('Collection')
        PromiseResult.forEach(function (Doc) {
          switch (Doc.ref.path.split('/')[0]) {
            case 'Parks':
              console.log('Ride doc')
              Ride = Doc.data()
              Ride.Id = Doc.id
              if (Ride.Logo) {
                                                		Ride.HasLogo = true
		                                        } else {
                		                                Ride.HasLogo = false
                        		                };
              Ride.Count = 0
              PageContext.Rides.push(Ride)
              break
            case 'Users':
              console.log('Ride count doc')
              console.log(Doc.data())
              RideId = Doc.data().Ride
              Count = Doc.data().Count
              if (RideCounts[RideId]) {
                RideCounts[RideId] = RideCounts[RideId] + Count
              } else {
                RideCounts[RideId] = Count
              };
              break
            default:
              console.log('Unknown first fragment')
              console.log(Doc.ref.path)
          };
        })
      };
    })
    PageContext.Rides.forEach(function (Ride, Index) {
      if (RideCounts[Ride.Id]) {
        PageContext.Rides[Index].Count = RideCounts[Ride.Id]
      };
    })
    PageContext.PageTitle = `${PageContext.Park.Name}\n${PageContext.Trip.DateHuman}`
    console.log(PageContext)
    const vm = fromObject(PageContext)
    page.bindingContext = vm
  }).catch(function (error) {
    console.log('Ride count get error')
    console.log(error)

    frameModule.topmost().navigate({
      moduleName: 'home/home-page',
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

function RideSelected (args) {
  TripId = args.view.TripId
  RideId = args.view.RideId
  ParkId = args.view.ParkId
  console.log(`Switching to ride count add/edit/delete for ride: ${RideId} on trip: ${TripId} to park: ${ParkId}`)
  frameModule.topmost().navigate({
    moduleName: 'ridecountRide/ridecountRide-page',
    backstackVisible: false,
    transition: {
      name: 'fade'
    },
    context: {
      TripId: TripId,
      ParkId: ParkId,
      RideId: RideId
    }
  })
};
exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
exports.pageJump = require('../shared/pageJump')
AuthenticatedPageState = require('../shared/AuthenticatedPageState')
exports.cmsPage = require('../shared/cmsPage')
exports.AuthenticatedPageState = AuthenticatedPageState
exports.onLoaded = onLoaded
exports.RideSelected = RideSelected

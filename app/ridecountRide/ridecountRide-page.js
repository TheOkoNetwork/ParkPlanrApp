const app = require('tns-core-modules/application')

const RidecountRideViewModel = require('./ridecountRide-view-model')
const fromObject = require('tns-core-modules/data/observable').fromObject
const frameModule = require('tns-core-modules/ui/frame')

const firebaseApp = require('nativescript-plugin-firebase/app')
firebaseApp.initializeApp()

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()

var color = require('color')

const moment = require('moment')

function onNavigatingTo (args) {
  var page = args.object
  page.bindingContext = new RidecountRideViewModel()

  const tripId = page.navigationContext.tripId
  const parkId = page.navigationContext.parkId
  const rideId = page.navigationContext.rideId
  const userId = page.bindingContext.user.uid

  console.log(
        `Loading ridecount ride add/edit for ride: ${rideId} in trip: ${tripId} to: ${parkId} for user: ${userId}`
  )

  var getPromises = [
    firebaseApp
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('ridecount')
      .doc(tripId)
      .get(),
    firebaseApp
      .firestore()
      .collection('parks')
      .doc(parkId)
      .collection('rides')
      .doc(rideId)
      .get(),
    firebaseApp
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('ridecount')
      .doc(tripId)
      .collection('rides')
      .where('ride', '==', rideId)
      .get()
  ]

  Promise.all(getPromises)
    .then(function (promiseResults) {
      var pageContext = {
        count: 0,
        counts: [],
        addEditCount: 1,
        user: page.bindingContext.user,
        parkId: parkId
      }
      promiseResults.forEach(function (promiseResult) {
        if (promiseResult.id) {
          console.log('Document')
          switch (promiseResult.ref.path.split('/')[0]) {
            case 'parks':
              console.log('Ride doc')
              var ride = promiseResult.data()
              ride.id = promiseResult.id
              if (ride.logo) {
                ride.hasLogo = true
              } else {
                ride.hasLogo = false
              }
              pageContext.ride = ride
              break
            case 'users':
              console.log('Trip doc')
              var trip = promiseResult.data()
              trip.id = promiseResult.id
              trip.dateHuman = moment(trip.date).format(
                'dddd DD/MM/YYYY'
              )
              pageContext.trip = trip
              break
            default:
              console.log('Unknown first fragment')
              console.log(promiseResult.ref.path)
          }
        } else {
          console.log('Collection')
          promiseResult.forEach(function (doc) {
            console.log(doc)
            switch (doc.ref.path.split('/')[0]) {
              case 'users':
                console.log('Ride count count doc')
                pageContext.count =
                                    pageContext.count + doc.data().count
                var countDoc = doc.data()
                countDoc.id = doc.id
                countDoc.timeHuman = moment(
                  doc.data().time
                ).format('HH:mm:ss')
                pageContext.counts.push(countDoc)
                break
              default:
                console.log('Unknown first fragment')
                console.log(doc.ref.path)
            }
          })
        }
      })
      pageContext.pageTitle = `${pageContext.ride.name.name}\n${pageContext.trip.dateHuman}`
      console.log(pageContext)
      const vm = fromObject(pageContext)
      page.bindingContext = vm
    })
    .catch(function (error) {
      console.log('Ride count get error')
      console.log(error)

      frameModule.topmost().navigate({
        moduleName: 'home/home-page',
        backstackVisible: false,
        transition: {
          name: 'fade'
        }
      })
      setTimeout(function () {
        feedback.error({
          title: 'Unable to load ride count',
          message: `Please check your internet connection and try again(${JSON.stringify(
                        error
                    )})`,
          titleColor: new color.Color('black')
        })
      }, 125)
    })
}

function onLoaded (args) {
  AuthenticatedPageState()
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView()
  sideDrawer.showDrawer()
}

function addEditCountAdd () {
  var frame = require('ui/frame')
  var page = frame.topmost().currentPage
  page.bindingContext.addEditCount++
}
function addEditCountSubtract () {
  var frame = require('ui/frame')
  var page = frame.topmost().currentPage
  var count = page.bindingContext.addEditCount
  count--
  page.bindingContext.addEditCount = Math.max(1, count)
}
function addEditCountSave () {
  var frame = require('ui/frame')
  var page = frame.topmost().currentPage
  var count = page.bindingContext.addEditCount
  var userId = page.bindingContext.user.uid
  var rideId = page.bindingContext.ride.id
  var parkId = page.bindingContext.parkId
  var tripId = page.bindingContext.trip.id
  console.log(
        `Adding ${count} rides on ride: ${rideId} for trip: ${tripId} to: ${parkId} for user: ${userId}`
  )
  firebaseApp
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('ridecount')
    .doc(tripId)
    .collection('rides')
    .doc()
    .set({
      ride: rideId,
      count: count,
      time: moment().toDate()
    })
    .then(function () {
      console.log('Server confirmed ride count write')
    })
    .catch(function (error) {
      console.log('Ride count add error')
      console.log(error)
      setTimeout(function () {
        feedback.error({
          title: 'Unable to add ride count',
          message:
                        'Please check your internet connection and try again',
          titleColor: new color.Color('black')
        })
      }, 130)
    })
  console.log('Assuming write succeeded')
  console.log(`Switching to trip: ${tripId} park: ${parkId}`)
  frameModule.topmost().navigate({
    moduleName: 'ridecountCount/ridecountCount-page',
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
      title: 'Added count',
      message: 'Saved ride count',
      titleColor: new color.Color('black')
    })
  }, 125)
}

function deleteTripCount (args) {
  var frame = require('ui/frame')
  var page = frame.topmost().currentPage
  const userId = page.bindingContext.user.uid
  const tripId = page.bindingContext.trip.id
  const parkId = page.bindingContext.parkId

  const countId = args.object.countId
  console.log(`Deleting count: ${countId}`)

  firebaseApp
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('ridecount')
    .doc(tripId)
    .collection('rides')
    .doc(countId)
    .delete()
    .then(function () {
      console.log('Server confirmed ride count delete')
    })
    .catch(function (error) {
      console.log('Ride count delete error')
      console.log(error)
      setTimeout(function () {
        feedback.error({
          title: 'Unable to delete ride count',
          message:
                        'Please check your internet connection and try again',
          titleColor: new color.Color('black')
        })
      }, 130)
    })
  console.log('Assuming delete succeeded')
  frameModule.topmost().navigate({
    moduleName: 'ridecountCount/ridecountCount-page',
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
      title: 'Removed count',
      message: 'Saved ride count',
      titleColor: new color.Color('black')
    })
  }, 125)
}

exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
exports.pageJump = require('../shared/pageJump')
var AuthenticatedPageState = require('../shared/AuthenticatedPageState')
exports.cmsPage = require('../shared/cmsPage')
exports.AuthenticatedPageState = AuthenticatedPageState
exports.onLoaded = onLoaded
exports.addEditCountAdd = addEditCountAdd
exports.addEditCountSubtract = addEditCountSubtract
exports.addEditCountSave = addEditCountSave
exports.deleteTripCount = deleteTripCount

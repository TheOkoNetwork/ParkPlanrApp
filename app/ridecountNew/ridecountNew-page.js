const app = require('tns-core-modules/application')

const RidecountNewViewModel = require('./ridecountNew-view-model')
const fromObject = require('tns-core-modules/data/observable').fromObject
const frameModule = require('tns-core-modules/ui/frame')

const firebaseApp = require('nativescript-plugin-firebase/app')
firebaseApp.initializeApp()

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()

var color = require('color')

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new RidecountNewViewModel()
  firebaseApp
    .firestore()
    .collection('parks')
    .where('active', '==', true)
    .where('ridecount', '==', true)
    .orderBy('name', 'asc')
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.docs.length) {
        console.log('Empty')
        frameModule.topmost().navigate({
          moduleName: 'home/home-page',
          transition: {
            name: 'fade'
          }
        })

        setTimeout(function () {
          feedback.error({
            title: 'Unable to load parks(empty)',
            message:
                            'Please check your internet connection and try again',
            titleColor: new color.Color('black')
          })
        }, 125)
      } else {
        console.log('Not empty')
        var parks = []
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`)
          parks.push({
            id: doc.id,
            name: doc.data().name,
            toString: () => {
              return doc.data().name
            }
          })
        })

        console.log(parks)
        const today = new Date()
        const minDate = new Date(1884, 0, 0)
        const vm = fromObject({
          parks: parks,
          date: today,
          today: today,
          minDate: minDate,
          user: page.bindingContext.user
        })
        page.bindingContext = vm
      }
    })
    .catch(function (error) {
      console.log('Error fetching parks')
      console.log(error)
      frameModule.topmost().navigate({
        moduleName: 'home/home-page',
        transition: {
          name: 'fade'
        }
      })

      setTimeout(function () {
        feedback.error({
          title: 'Unable to load parks',
          message:
                        'Please check your internet connection and try again',
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

function createTrip () {
  var page = frameModule.topmost().currentPage

  var userId = page.bindingContext.user.uid
  var trip = {}
  trip.park =
        page.bindingContext.parks[page.getViewById('park').selectedIndex].id
  trip.date = page.bindingContext.date
  console.log(
        `Creating trip to ${trip.park} for user: ${userId} on date ${trip.date}`
  )

  console.log(firebaseApp.Timestamp)
  firebaseApp
    .firestore()
    .collection('users')
    .doc(userId)
    .collection('ridecount')
    .add({
      park: trip.park,
      date: trip.date,
      totalRides: 0
    })
    .then(function (tripDocRef) {
      feedback.error({
        title: 'Trip created',
        message: `${JSON.stringify(tripDocRef)}`,
        titleColor: new color.Color('black')
      })

      // console.log('Trip created with ID: ', tripDocRef.id)

      // frameModule.topmost().navigate({
      //  moduleName: 'ridecountCount/ridecountCount-page',
      //  transition: {
      //    name: 'fade'
      //  },
      //  context: {
      //    tripId: tripDocRef.id,
      //    parkId: trip.park
      //  }
      // })
    })
    .catch(function (error) {
      console.error('Error creating trip document: ', error)

      setTimeout(function () {
        feedback.error({
          title: 'Unable to start trip',
          message: `Please check your internet connection and try again ${JSON.stringify(
                        error
                    )}`,
          titleColor: new color.Color('black')
        })
      }, 125)
    })
}

exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
exports.pageJump = require('../shared/pageJump')
var AuthenticatedPageState = require('../shared/AuthenticatedPageState')
exports.cmsPage = require('../shared/cmsPage')
exports.AuthenticatedPageState = AuthenticatedPageState
exports.onLoaded = onLoaded
exports.createTrip = createTrip

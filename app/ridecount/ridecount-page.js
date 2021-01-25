const app = require("@nativescript/core/application");
const frameModule = require("@nativescript/core/ui/frame");

const RidecountViewModel = require("./ridecount-view-model");
const fromObject = require("@nativescript/core/data/observable").fromObject;

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();

const color = require("tns-core-modules/color");

const moment = require("moment");

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new RidecountViewModel();

  const userId = page.bindingContext.user.uid;
  const tripDataPromises = [
    firebaseApp
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("ridecount")
      .orderBy("date", "desc")
      .get(),
    firebaseApp
      .firestore()
      .collection("parks")
      .where("active", "==", true)
      .get()
  ];
  Promise.all(tripDataPromises)
    .then((promiseResults) => {
      const parks = {};
      const trips = [];
      promiseResults.forEach((promiseResult) => {
        promiseResult.forEach((doc) => {
          const parentCollection = doc.ref.path.split("/")[0];
          switch (parentCollection) {
            case "parks":
              parks[doc.id] = doc.data();
              parks[doc.id].id = doc.id;
              break;
            case "users":
              var trip = doc.data();
              trip.humanDate = moment(doc.data().date).format(
                "dddd DD/MM/YYYY"
              );
              trip.id = doc.id;
              trips.push(trip);
              break;
            default:
              console.log(
                                `Unknown parent collection: ${parentCollection}`
              );
          }
        });
      });
      trips.forEach((trip, tripIndex) => {
        trips[tripIndex].park = parks[trip.park];
      });
      console.log(trips);
      const vm = fromObject({
        trips: trips
      });
      page.bindingContext = vm;
    })
    .catch((error) => {
      console.log("Error fetching trips");
      console.log(error);
      frameModule.Frame.topmost().navigate({
        moduleName: "home/home-page",
        transition: {
          name: "fade"
        }
      });

      setTimeout(() => {
        feedback.error({
          title: "Unable to load trip",
          message:
                        "Please check your internet connection and try again",
          titleColor: new color.Color("black")
        });
      }, 125);
    });
}

function onTripSelect (args) {
  const tripId = args.view.tripId;
  const parkId = args.view.parkId;
  console.log(`Switching to trip: ${tripId} park: ${parkId}`);
  frameModule.Frame.topmost().navigate({
    moduleName: "ridecountCount/ridecountCount-page",
    transition: {
      name: "fade"
    },
    context: {
      tripId: tripId,
      parkId: parkId
    }
  });
}

function onTripLongSelect (args) {
  const tripId = args.view.tripId;
  const parkId = args.view.parkId;
  console.log(
        `Switching to delete confirm for trip: ${tripId} park: ${parkId}`
  );

  frameModule.Frame.topmost().navigate({
    moduleName: "ridecountDelete/ridecountDelete-page",
    transition: {
      name: "fade"
    },
    context: {
      tripId: tripId,
      parkId: parkId
    }
  });
}

function onLoaded (args) {
  AuthenticatedPageState();
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView();
  sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
var AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.onTripSelect = onTripSelect;
exports.onTripLongSelect = onTripLongSelect;

const {
  Application,
  Color,
  Frame
} = require('@nativescript/core');

const RidecountDeleteViewModel = require("./ridecountDelete-view-model");
const fromObject = require("@nativescript/core/data/observable").fromObject;

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();

const moment = require("moment");

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new RidecountDeleteViewModel();

  const tripId = page.navigationContext.tripId;
  const parkId = page.navigationContext.parkId;
  const userId = page.bindingContext.user.uid;

  console.log(
        `Loading ridecount delete confirmation for trip: ${tripId} to: ${parkId} for user: ${userId}`
  );

  const getPromises = [
    firebaseApp
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("ridecount")
      .doc(tripId)
      .get(),
    firebaseApp.firestore().collection("parks").doc(parkId).get()
  ];

  Promise.all(getPromises)
    .then((promiseResults) => {
      const pageContext = {
        user: page.bindingContext.user,
        parkId: parkId
      };
      promiseResults.forEach((promiseResult) => {
        if (promiseResult.id) {
          console.log("Document");
          switch (promiseResult.ref.path.split("/")[0]) {
            case "users":
              console.log("Trip doc");
              var trip = promiseResult.data();
              trip.id = promiseResult.id;
              trip.dateHuman = moment(trip.date).format(
                "dddd DD/MM/YYYY"
              );
              pageContext.trip = trip;
              break;
            case "parks":
              console.log("Park doc");
              var park = promiseResult.data();
              park.id = promiseResult.id;
              pageContext.park = park;
              break;
            default:
              console.log("Unknown first fragment");
              console.log(promiseResult.ref.path);
          }
        } else {
          console.log("Collection");
          promiseResult.forEach((doc) => {
            console.log(doc);
            switch (doc.ref.path.split("/")[0]) {
              default:
                console.log("Unknown first fragment");
                console.log(doc.ref.path);
            }
          });
        }
      });
      pageContext.pageTitle = `Deleting trip\n${pageContext.park.name.name}\n${pageContext.trip.dateHuman}`;
      console.log(pageContext);
      const vm = fromObject(pageContext);
      page.bindingContext = vm;
    })
    .catch((error) => {
      console.log("Ride count get error");
      console.log(error);

      Frame.topmost().navigate({
        moduleName: "ridecount/ridecount-page",
        backstackVisible: false,
        transition: {
          name: "fade"
        }
      });
      setTimeout(() => {
        feedback.error({
          title: "Unable to load ride count",
          message:
                        "Please check your internet connection and try again",
          titleColor: new Color("black")
        });
      }, 125);
    });
}

function onLoaded (args) {
  AuthenticatedPageState();
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

function returnToRidecount () {
  console.log("Cancelling, returning to ride count");
  const page = Frame.topmost().currentPage;

  const parkId = page.bindingContext.parkId;
  const tripId = page.bindingContext.trip.id;

  Frame.topmost().navigate({
    moduleName: "ridecount/ridecount-page",
    backstackVisible: false,
    transition: {
      name: "fade"
    },
    context: {
      tripId: tripId,
      parkId: parkId
    }
  });
}
function deleteRidecount () {
  const page = Frame.topmost().currentPage;
  const userId = page.bindingContext.user.uid;
  const parkId = page.bindingContext.parkId;
  const tripId = page.bindingContext.trip.id;

  console.log(`Deleting trip: ${tripId} for user: ${userId}`);
  firebaseApp
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("ridecount")
    .doc(tripId)
    .delete()
    .then(() => {
      console.log("Server confirmed ride count delete");
    })
    .catch((error) => {
      console.log("Ride count delete error");
      console.log(error);
      setTimeout(() => {
        feedback.error({
          title: "Unable to delete ride count",
          message:
                        "Please check your internet connection and try again",
          titleColor: new Color("black")
        });
      }, 130);
    });
  console.log("Assuming delete succeeded, switching to ride count list");
  Frame.topmost().navigate({
    moduleName: "ridecount/ridecount-page",
    backstackVisible: false,
    transition: {
      name: "fade"
    },
    context: {
      tripId: tripId,
      parkId: parkId
    }
  });
  setTimeout(() => {
    feedback.success({
      title: "Deleted count",
      message: "Ride count deleted",
      titleColor: new Color("black")
    });
  }, 125);
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
var AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.returnToRidecount = returnToRidecount;
exports.deleteRidecount = deleteRidecount;

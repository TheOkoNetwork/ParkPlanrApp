const {
  Application,
  Color,
  Frame
} = require('@nativescript/core');

const RidecountRideViewModel = require("./ridecountRide-view-model");
const fromObject = require("@nativescript/core/data/observable").fromObject;

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();


const moment = require("moment");

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new RidecountRideViewModel();

  const tripId = page.navigationContext.tripId;
  const parkId = page.navigationContext.parkId;
  const rideId = page.navigationContext.rideId;
  const userId = page.bindingContext.user.uid;

  console.log(
        `Loading ridecount ride add/edit for ride: ${rideId} in trip: ${tripId} to: ${parkId} for user: ${userId}`
  );

  const getPromises = [
    firebaseApp
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("ridecount")
      .doc(tripId)
      .get(),
    firebaseApp
      .firestore()
      .collection("parks")
      .doc(parkId)
      .collection("rides")
      .doc(rideId)
      .get(),
    firebaseApp
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("ridecount")
      .doc(tripId)
      .collection("rides")
      .where("ride", "==", rideId)
      .get()
  ];

  Promise.all(getPromises)
    .then((promiseResults) => {
      const pageContext = {
        count: 0,
        counts: [],
        addEditCount: 1,
        user: page.bindingContext.user,
        parkId: parkId
      };
      promiseResults.forEach((promiseResult) => {
        if (promiseResult.id) {
          console.log("Document");
          switch (promiseResult.ref.path.split("/")[0]) {
            case "parks":
              console.log("Ride doc");
              var ride = promiseResult.data();
              ride.id = promiseResult.id;
              if (ride.logo) {
                ride.hasLogo = true;
              } else {
                ride.hasLogo = false;
              }
              pageContext.ride = ride;
              break;
            case "users":
              console.log("Trip doc");
              var trip = promiseResult.data();
              trip.id = promiseResult.id;
              trip.dateHuman = moment(trip.date).format(
                "dddd DD/MM/YYYY"
              );
              pageContext.trip = trip;
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
              case "users":
                console.log("Ride count count doc");
                pageContext.count =
                                    pageContext.count + doc.data().count;
                var countDoc = doc.data();
                countDoc.id = doc.id;
                countDoc.timeHuman = moment(
                  doc.data().time
                ).format("HH:mm:ss");
                pageContext.counts.push(countDoc);
                break;
              default:
                console.log("Unknown first fragment");
                console.log(doc.ref.path);
            }
          });
        }
      });
      pageContext.pageTitle = `${pageContext.ride.name.name}\n${pageContext.trip.dateHuman}`;
      console.log(pageContext);
      const vm = fromObject(pageContext);
      page.bindingContext = vm;
    })
    .catch((error) => {
      console.log("Ride count get error");
      console.log(error);

      Frame.topmost().navigate({
        moduleName: "home/home-page",
        backstackVisible: false,
        transition: {
          name: "fade"
        }
      });
      setTimeout(() => {
        feedback.error({
          title: "Unable to load ride count",
          message: `Please check your internet connection and try again(${JSON.stringify(
                        error
                    )})`,
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

function addEditCountAdd () {
  const page = Frame.topmost().currentPage;
  page.bindingContext.addEditCount++;
}
function addEditCountSubtract () {
  const page = Frame.topmost().currentPage;
  let count = page.bindingContext.addEditCount;
  count--;
  page.bindingContext.addEditCount = Math.max(1, count);
}
function addEditCountSave () {
  const page = Frame.topmost().currentPage;
  const count = page.bindingContext.addEditCount;
  const userId = page.bindingContext.user.uid;
  const rideId = page.bindingContext.ride.id;
  const parkId = page.bindingContext.parkId;
  const tripId = page.bindingContext.trip.id;
  console.log(
        `Adding ${count} rides on ride: ${rideId} for trip: ${tripId} to: ${parkId} for user: ${userId}`
  );
  firebaseApp
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("ridecount")
    .doc(tripId)
    .collection("rides")
    .doc()
    .set({
      ride: rideId,
      count: count,
      time: moment().toDate()
    })
    .then(() => {
      console.log("Server confirmed ride count write");
    })
    .catch((error) => {
      console.log("Ride count add error");
      console.log(error);
      setTimeout(() => {
        feedback.error({
          title: "Unable to add ride count",
          message:
                        "Please check your internet connection and try again",
          titleColor: new Color("black")
        });
      }, 130);
    });
  console.log("Assuming write succeeded");
  console.log(`Switching to trip: ${tripId} park: ${parkId}`);
  Frame.topmost().navigate({
    moduleName: "ridecountCount/ridecountCount-page",
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
      title: "Added count",
      message: "Saved ride count",
      titleColor: new Color("black")
    });
  }, 125);
}

function deleteTripCount (args) {
  const page = Frame.topmost().currentPage;
  const userId = page.bindingContext.user.uid;
  const tripId = page.bindingContext.trip.id;
  const parkId = page.bindingContext.parkId;

  const countId = args.object.countId;
  console.log(`Deleting count: ${countId}`);

  firebaseApp
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("ridecount")
    .doc(tripId)
    .collection("rides")
    .doc(countId)
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
  console.log("Assuming delete succeeded");
  Frame.topmost().navigate({
    moduleName: "ridecountCount/ridecountCount-page",
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
      title: "Removed count",
      message: "Saved ride count",
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
exports.addEditCountAdd = addEditCountAdd;
exports.addEditCountSubtract = addEditCountSubtract;
exports.addEditCountSave = addEditCountSave;
exports.deleteTripCount = deleteTripCount;

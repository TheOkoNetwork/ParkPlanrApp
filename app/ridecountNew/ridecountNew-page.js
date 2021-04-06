const {
  Application,
  Color,
  Frame
} = require('@nativescript/core');

const RidecountNewViewModel = require("./ridecountNew-view-model");
const fromObject = require("@nativescript/core/data/observable").fromObject;
const frameModule = require("@nativescript/core/ui/frame");

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new RidecountNewViewModel();
  firebaseApp
    .firestore()
    .collection("parks")
    .where("active", "==", true)
    .where("ridecount", "==", true)
    .orderBy("name.name", "asc")
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.docs.length) {
        console.log("Empty");
        frameModule.Frame.topmost().navigate({
          moduleName: "home/home-page",
          transition: {
            name: "fade"
          }
        });

        setTimeout(() => {
          feedback.error({
            title: "Unable to load parks(empty)",
            message:
                            "Please check your internet connection and try again",
            titleColor: new Color("black")
          });
        }, 125);
      } else {
        console.log("Not empty");
        const parks = [];
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
          parks.push({
            id: doc.id,
            name: doc.data().name.name,
            toString: () => doc.data().name.name
          });
        });

        console.log(parks);
        const today = new Date();
        const minDate = new Date(1884, 0, 0);
        const vm = fromObject({
          parks: parks,
          date: today,
          today: today,
          minDate: minDate,
          user: page.bindingContext.user
        });
        page.bindingContext = vm;
      }
    })
    .catch((error) => {
      console.log("Error fetching parks");
      console.log(error);
      frameModule.Frame.topmost().navigate({
        moduleName: "home/home-page",
        transition: {
          name: "fade"
        }
      });

      setTimeout(() => {
        feedback.error({
          title: "Unable to load parks",
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

function createTrip () {
  const page = frameModule.Frame.topmost().currentPage;

  const userId = page.bindingContext.user.uid;
  const trip = {};
  trip.park =
        page.bindingContext.parks[page.getViewById("park").selectedIndex].id;
  trip.date = page.bindingContext.date;
  console.log(
        `Creating trip to ${trip.park} for user: ${userId} on date ${trip.date}`
  );

  console.log(firebaseApp.Timestamp);
  firebaseApp
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("ridecount")
    .add({
      park: trip.park,
      date: trip.date,
      totalRides: 0
    })
    .then((tripDocRef) => {
      console.log("Trip created with ID: ", tripDocRef.id);

      feedback.error({
        title: "Trip created",
        message: `parkId: ${trip.park} tripId: ${tripDocRef.id}`,
        titleColor: new Color("black")
      });

      frameModule.Frame.topmost().navigate({
        moduleName: "ridecountCount/ridecountCount-page",
        transition: {
          name: "fade"
        },
        context: {
          tripId: tripDocRef.id,
          parkId: trip.park
        }
      });
    })
    .catch((error) => {
      console.error("Error creating trip document: ", error);

      setTimeout(() => {
        feedback.error({
          title: "Unable to start trip",
          message: `Please check your internet connection and try again ${JSON.stringify(
                        error
                    )}`,
          titleColor: new Color("black")
        });
      }, 125);
    });
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
var AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.createTrip = createTrip;

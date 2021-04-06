const {
  Application,
  Color
} = require('@nativescript/core');

const QueuetimesViewModel = require("./queuetimes-view-model");
const fromObject = require("@nativescript/core/data/observable").fromObject;

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();
const frameModule = require("@nativescript/core/ui/frame");

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new QueuetimesViewModel();

  firebaseApp
    .firestore()
    .collection("parks")
    .where("active", "==", true)
    .where("queuetimes", "==", true)
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
            title: "Unable to load queue times",
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
          const park = doc.data();
          park.id = doc.id;
          parks.push(park);
        });

        console.log(parks);
        const vm = fromObject({
          parks: parks
        });
        page.bindingContext = vm;
      }
    })
    .catch((error) => {
      console.log("Error fetching parks with queue times enabled");
      console.log(error);
      frameModule.Frame.topmost().navigate({
        moduleName: "home/home-page",
        transition: {
          name: "fade"
        }
      });

      setTimeout(() => {
        feedback.error({
          title: "Unable to load queue times",
          message:
                        "Please check your internet connection and try again",
          titleColor: new Color("black")
        });
      }, 125);
    });
}

function onLoaded (args) {
  // frameModule = require('@nativescript/core/ui/frame')
  // page = frameModule.Frame.topmost().currentPage
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

function parkSelected (args) {
  const parkId = args.view.parkId;
  console.log(`Park: ${parkId} Selected`);

  frameModule.Frame.topmost().navigate({
    moduleName: "queuetimesPark/queuetimesPark-page",
    transition: {
      name: "fade"
    },
    context: {
      parkId: parkId
    }
  });
}
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
const AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.parkSelected = parkSelected;

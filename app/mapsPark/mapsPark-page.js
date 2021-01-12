const app = require("@nativescript/core/application");

const MapsParkViewModel = require("./mapsPark-view-model");
const fromObject = require("@nativescript/core/data/observable").fromObject;
const frameModule = require("@nativescript/core/ui/frame");

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();
const color = require("tns-core-modules/color");

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new MapsParkViewModel();

  const parkId = page.navigationContext.parkId;
  console.log(`Loading map for park: ${parkId}`);

  console.log("Fetching park data");
  firebaseApp
    .firestore()
    .collection("parks")
    .doc(parkId)
    .get()
    .then((parkSnapshot) => {
      console.log("park data");
      const mapUrl = parkSnapshot.data().map;
      const vm = fromObject({
        mapUrl: mapUrl,
        parkName: parkSnapshot.data().name
      });
      page.bindingContext = vm;
    })
    .catch((error) => {
      console.log(`Error fetching map for park: ${parkId}`);
      console.log(error);

      frameModule.Frame.topmost().navigate({
        moduleName: "home/home-page",
        transition: {
          name: "fade"
        }
      });
      setTimeout(() => {
        feedback.error({
          title: "Unable to load map",
          message:
                        "Please check your internet connection and try again",
          titleColor: new color.Color("black")
        });
      }, 125);
    });
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView();
  sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
const AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;

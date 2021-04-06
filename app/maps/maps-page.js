const {
  Application,
  Color
} = require('@nativescript/core');
const MapsViewModel = require("./maps-view-model");
const fromObject = require("@nativescript/core/data/observable").fromObject;
const frameModule = require("@nativescript/core/ui/frame");

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new MapsViewModel();

  firebaseApp
    .firestore()
    .collection("parks")
    .where("active", "==", true)
    .where("maps", "==", true)
    .orderBy("name", "asc")
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
            title: "Unable to load maps",
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
      console.log("Error fetching parks with maps enabled");
      console.log(error);
      frameModule.Frame.topmost().navigate({
        moduleName: "home/home-page",
        transition: {
          name: "fade"
        }
      });

      setTimeout(() => {
        feedback.error({
          title: "Unable to load maps",
          message:
                        "Please check your internet connection and try again",
          titleColor: new Color("black")
        });
      }, 125);
    });
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

function parkSelected (args) {
  const parkId = args.view.parkId;
  console.log(`Park: ${parkId} Selected`);

  frameModule.Frame.topmost().navigate({
    moduleName: "mapsPark/mapsPark-page",
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
exports.parkSelected = parkSelected;

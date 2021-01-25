const app = require("@nativescript/core/application");

const QueuetimesParkViewModel = require("./queuetimesPark-view-model");
const fromObject = require("@nativescript/core/data/observable").fromObject;
const frameModule = require("@nativescript/core/ui/frame");

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();
const color = require("tns-core-modules/color");

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new QueuetimesParkViewModel();

  const parkId = page.navigationContext.parkId;
  console.log(`Loading queue times for park: ${parkId}`);

  console.log("Fetching park data");
  firebaseApp
    .firestore()
    .collection("parks")
    .doc(parkId)
    .get()
    .then((parkSnapshot) => {
      console.log("Park data");
      console.log(parkSnapshot.data());
      page.getViewById("pageTitle").text = parkSnapshot.data().name.name;
      if (!parkSnapshot.data().open) {
        frameModule.Frame.topmost().navigate({
          moduleName: "queuetimes/queuetimes-page",
          transition: {
            name: "fade"
          }
        });
        let parkClosedMessage;
        if (parkSnapshot.data().closedMessage) {
          parkClosedMessage = parkSnapshot.data().closedMessage;
        } else {
          parkClosedMessage = "This attraction is currently closed";
        }
        setTimeout(() => {
          feedback.error({
            title: `${parkSnapshot.data().name.name} is closed`,
            message: parkClosedMessage,
            titleColor: new color.Color("black")
          });
        }, 125);

        return;
      }

      console.log("Fetching ride data");
      firebaseApp
        .firestore()
        .collection("parks")
        .doc(parkId)
        .collection("rides")
        .where("queuetimes", "==", true)
        .where("active", "==", true)
        .orderBy("name.name", "asc")
        .onSnapshot(
          (snapshot) => {
            console.log("Ride data");

            const rides = [];
            snapshot.forEach((doc) => {
              console.log(
                                `${doc.id} => ${JSON.stringify(doc.data())}`
              );
              const ride = doc.data();
              ride.id = doc.id;
              if (ride.logo) {
                ride.hasLogo = true;
              } else {
                ride.hasLogo = false;
              }
              if (!ride.closedReason) {
                ride.closedReason = "&#xf05e; closed";
              }

              rides.push(ride);
            });

            console.log(rides);
            const vm = fromObject({
              rides: rides
            });
            page.bindingContext = vm;
          },
          (error) => {
            console.log("Queue times ride data error");
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
                message: `Please check your internet connection and try again ${JSON.stringify(
                                    error
                                )}-1`,
                titleColor: new color.Color("black")
              });
            }, 125);
          }
        );
    })
    .catch((error) => {
      console.log(`Error fetching queue times for park: ${parkId}`);
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
          message: `Please check your internet connection and try again ${JSON.stringify(
                        error
                    )}`,
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

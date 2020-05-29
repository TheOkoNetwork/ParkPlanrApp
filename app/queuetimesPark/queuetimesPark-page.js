const app = require("tns-core-modules/application");
const Observable = require("tns-core-modules/data/observable").Observable;

const QueuetimesParkViewModel = require("./queuetimesPark-view-model");
const fromObject = require("tns-core-modules/data/observable").fromObject;

const firebaseApp = require("nativescript-plugin-firebase/app");
firebaseApp.initializeApp();

var FeedbackPlugin = require("nativescript-feedback");
var feedback = new FeedbackPlugin.Feedback();
var color = require("color");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new QueuetimesParkViewModel();

    parkId = page.navigationContext.parkId;
    console.log(`Loading queue times for park: ${parkId}`);

    console.log("Fetching park data");
    firebaseApp
        .firestore()
        .collection("parks")
        .doc(parkId)
        .get()
        .then(function (parkSnapshot) {
            console.log("Park data");
            console.log(parkSnapshot.data());
            page.getViewById("pageTitle").text = parkSnapshot.data().name;
            if (!parkSnapshot.data().open) {
                frameModule.topmost().navigate({
                    moduleName: "queuetimes/queuetimes-page",
                    transition: {
                        name: "fade",
                    },
                });
                if (parkSnapshot.data().closedMessage) {
                    parkClosedMessage = parkSnapshot.data().closedMessage;
                } else {
                    parkClosedMessage = "This attraction is currently closed";
                }
                setTimeout(function () {
                    feedback.error({
                        title: `${parkSnapshot.data().name} is closed`,
                        message: parkClosedMessage,
                        titleColor: new color.Color("black"),
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
                .where("queueTimes", "==", true)
                .orderBy("name", "asc")
                .onSnapshot(
                    (snapshot) => {
                        console.log("Ride data");

                        rides = [];
                        snapshot.forEach((doc) => {
                            console.log(
                                `${doc.id} => ${JSON.stringify(doc.data())}`
                            );
                            ride = doc.data();
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
                            rides: rides,
                        });
                        page.bindingContext = vm;
                    },
                    function (error) {
                        console.log("Queue times ride data error");
                        console.log(error);

                        frameModule.topmost().navigate({
                            moduleName: "home/home-page",
                            transition: {
                                name: "fade",
                            },
                        });
                        setTimeout(function () {
                            feedback.error({
                                title: "Unable to load queue times",
                                message:
                                    "Please check your internet connection and try again",
                                titleColor: new color.Color("black"),
                            });
                        }, 125);
                    }
                );
        })
        .catch(function (error) {
            console.log(`Error fetching queue times for park: ${parkId}`);
            console.log(error);

            frameModule.topmost().navigate({
                moduleName: "home/home-page",
                transition: {
                    name: "fade",
                },
            });
            setTimeout(function () {
                feedback.error({
                    title: "Unable to load queue times",
                    message:
                        "Please check your internet connection and try again",
                    titleColor: new color.Color("black"),
                });
            }, 125);
        });
}

function onLoaded(args) {
    frameModule = require("tns-core-modules/ui/frame");
    page = frameModule.topmost().currentPage;
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;

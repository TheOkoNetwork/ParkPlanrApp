const app = require("tns-core-modules/application");
// const Observable = require('tns-core-modules/data/observable').Observable

const QueuetimesViewModel = require("./queuetimes-view-model");
const fromObject = require("tns-core-modules/data/observable").fromObject;

const firebaseApp = require("nativescript-plugin-firebase/app");
firebaseApp.initializeApp();

var FeedbackPlugin = require("nativescript-feedback");
var feedback = new FeedbackPlugin.Feedback();
var color = require("color");
const frameModule = require("tns-core-modules/ui/frame");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new QueuetimesViewModel();

    firebaseApp
        .firestore()
        .collection("parks")
        .where("active", "==", true)
        .where("queuetimes", "==", true)
        .orderBy("name", "asc")
        .get()
        .then((querySnapshot) => {
            if (!querySnapshot.docs.length) {
                console.log("Empty");

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
            } else {
                console.log("Not empty");
                var parks = [];
                querySnapshot.forEach((doc) => {
                    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
                    var park = doc.data();
                    park.id = doc.id;
                    parks.push(park);
                });

                console.log(parks);
                const vm = fromObject({
                    parks: parks,
                });
                page.bindingContext = vm;
            }
        })
        .catch(function (error) {
            console.log("Error fetching parks with queue times enabled");
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
    // frameModule = require('tns-core-modules/ui/frame')
    // page = frameModule.topmost().currentPage
}

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function parkSelected(args) {
    var parkId = args.view.parkId;
    console.log(`Park: ${parkId} Selected`);

    frameModule.topmost().navigate({
        moduleName: "queuetimesPark/queuetimesPark-page",
        transition: {
            name: "fade",
        },
        context: {
            parkId: parkId,
        },
    });
}
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
var AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.parkSelected = parkSelected;

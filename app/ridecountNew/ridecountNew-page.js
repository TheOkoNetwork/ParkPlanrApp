const app = require("tns-core-modules/application");

const RidecountNewViewModel = require("./ridecountNew-view-model");
const fromObject = require("tns-core-modules/data/observable").fromObject;

const firebaseApp = require("nativescript-plugin-firebase/app");
firebaseApp.initializeApp();

var FeedbackPlugin = require("nativescript-feedback");
var feedback = new FeedbackPlugin.Feedback();

frameModule = require("tns-core-modules/ui/frame");
var color = require("color");

const LoadingIndicator = require('@nstudio/nativescript-loading-indicator').LoadingIndicator;
const Mode = require('@nstudio/nativescript-loading-indicator').Mode;
const loader = new LoadingIndicator();

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new RidecountNewViewModel();
	firebaseApp.firestore().collection("Parks").where("Active","==",true).where("RideCount","==",true).orderBy("Name","asc").get().then(querySnapshot => {
                if (!querySnapshot.docs.length) {
                        console.log("Empty");
                        frameModule.topmost().navigate({
                                moduleName: "home/home-page",
                                transition: {
                                        name: "fade"
                                }
                        });

                        setTimeout(function() {
                                feedback.error({
                                        title: "Unable to load parks",
                                        message: "Please check your internet connection and try again",
                                        titleColor: new color.Color("black")
                                });
                        }, 125);
                } else {
                        console.log("Not empty");
                        Parks=[];
                        querySnapshot.forEach(doc => {
                                console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
			        Parks.push({ id: doc.id, name: doc.data().Name, toString: () => { return doc.data().Name; } });
                        });

                        console.log(Parks);
			const TODAY = new Date();
			const MINDATE=new Date(1884, 0, 0);
                        const vm = fromObject({
                                Parks: Parks,
				Date: TODAY,
				Today: TODAY,
				MinDate: MINDATE,
				user: page.bindingContext.user
                        });
                        page.bindingContext = vm;
                };
        }).catch(function(error) {
                        console.log("Error fetching parks");
                        console.log(error);
                        frameModule.topmost().navigate({
                                moduleName: "home/home-page",
                                transition: {
                                        name: "fade"
                                }
                        });

                        setTimeout(function() {
                                feedback.error({
                                        title: "Unable to load parks",
                                        message: "Please check your internet connection and try again",
                                        titleColor: new color.Color("black")
                                });
                        }, 125);
        });
}

function onLoaded(args) {
	AuthenticatedPageState();
};

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function CreateTrip() {
        page=frameModule.topmost().currentPage;

	UserId=page.bindingContext.user.uid;
	Trip={};
	Trip.Park=page.bindingContext.Parks[page.getViewById('Park').selectedIndex].id;
	Trip.Date=page.bindingContext.Date;
	console.log(`Creating trip to ${Trip.Park} for user: ${UserId} on date ${Trip.Date}`);

        const options = {
          message: 'Starting trip',
          details: 'Just a sec',
          margin: 10,
          dimBackground: true,
          color: '#4B9ED6',
          hideBezel: true
        };
        loader.show(options);

	console.log(firebaseApp.Timestamp);
	firebaseApp.firestore().collection("Users").doc(UserId).collection("RideCount").add({
		Park: Trip.Park,
		Date: Trip.Date,
		TotalRides: 0
	}).then(function(TripDocRef) {
		console.log("Trip created with ID: ", TripDocRef.id);
		loader.hide();

		frameModule.topmost().navigate({
	                moduleName: "ridecountCount/ridecountCount-page",
	                transition: {
	                        name: "fade"
	                },
	                context: {
	                        TripId: TripDocRef.id
	                }
	        });
	}).catch(function(error) {
		console.error("Error creating trip document: ", error);
		loader.hide();

		setTimeout(function() {
			feedback.error({
				title: "Unable to start trip",
				message: "Please check your internet connection and try again",
				titleColor: new color.Color("black")
			});
		}, 125);
	});
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump")
AuthenticatedPageState = require("../shared/AuthenticatedPageState")
exports.cmsPage = require("../shared/cmsPage")
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.CreateTrip = CreateTrip;

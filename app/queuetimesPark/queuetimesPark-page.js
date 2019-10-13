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

        ParkId=page.navigationContext.ParkId;
	console.log(`Loading queue times for park: ${ParkId}`);

	console.log("Fetching park data");
	firebaseApp.firestore().collection("Parks").doc(ParkId).get().then(function(ParkSnapshot) {
		console.log("Park data");
		console.log(ParkSnapshot.data());
                page.getViewById('PageTitle').text=ParkSnapshot.data().Name;

		console.log("Fetching ride data");
		firebaseApp.firestore().collection("Parks").doc(ParkId).collection("Rides").where("QueueTimes","==",true).orderBy("Name","asc").onSnapshot((snapshot) => {
				console.log("Ride data");

				Rides=[];
	                        snapshot.forEach(doc => {
	                                console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
	                                Ride=doc.data();
	                                Ride.id=doc.id;
					if (Ride.Logo) {
						Ride.HasLogo=true;
					} else {
						Ride.HasLogo=false;
					};
	                                Rides.push(Ride);
	                        });

	                        console.log(Rides);
	                        const vm = fromObject({
	                                Rides: Rides
	                        });
	                        page.bindingContext = vm;
		}, function(error) {
			console.log("Queue times ride data error");
			console.log(error);

			frameModule.topmost().navigate({
				moduleName: "home/home-page",
				transition: {
					name: "fade"
				}
			});
			setTimeout(function() {
				feedback.error({
					title: "Unable to load queue times",
					message: "Please check your internet connection and try again",
					titleColor: new color.Color("black")
				});
			}, 125);
		});
	}).catch(function(error) {
		console.log(`Error fetching queue times for park: ${ParkId}`);
		console.log(error);

		frameModule.topmost().navigate({
			moduleName: "home/home-page",
			transition: {
				name: "fade"
			}
		});
		setTimeout(function() {
			feedback.error({
				title: "Unable to load queue times",
				message: "Please check your internet connection and try again",
				titleColor: new color.Color("black")
			});
		}, 125);
	});
}

function onLoaded(args) {
	frameModule = require("tns-core-modules/ui/frame");
        page=frameModule.topmost().currentPage;
};

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}

function ParkSelected(args) {
	ParkId=args.view.ParkId;
	console.log(`Park: ${ParkId} Selected`);

	frameModule.topmost().navigate({
                moduleName: "queuetimesPark/queuetimesPark-page",
                transition: {
                        name: "fade"
                },
                context: {
                        ParkId: ParkId
                }
        });
};
exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump")
AuthenticatedPageState = require("../shared/AuthenticatedPageState")
exports.cmsPage = require("../shared/cmsPage")
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.ParkSelected = ParkSelected;

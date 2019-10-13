const app = require("tns-core-modules/application");

const RidecountRideViewModel = require("./ridecountRide-view-model");
const fromObject = require("tns-core-modules/data/observable").fromObject;

const firebaseApp = require("nativescript-plugin-firebase/app");
firebaseApp.initializeApp();

var FeedbackPlugin = require("nativescript-feedback");
var feedback = new FeedbackPlugin.Feedback();

frameModule = require("tns-core-modules/ui/frame");
var color = require("color");

const moment = require("moment");

function onNavigatingTo(args) {
	page=args.object;
	page.bindingContext = new RidecountRideViewModel();

	TripId=page.navigationContext.TripId;
	ParkId=page.navigationContext.ParkId;
	RideId=page.navigationContext.RideId;
        UserId=page.bindingContext.user.uid;

        console.log(`Loading ridecount ride add/edit for ride: ${RideId} in trip: ${TripId} to: ${ParkId} for user: ${UserId}`);

	GetPromises=[
		firebaseApp.firestore().collection("Users").doc(UserId).collection("RideCount").doc(TripId).get(),
		firebaseApp.firestore().collection("Parks").doc(ParkId).collection("Rides").doc(RideId).get(),
                firebaseApp.firestore().collection("Users").doc(UserId).collection("RideCount").doc(TripId).collection("Rides").where("Ride","==",RideId).get()
	];

	Promise.all(GetPromises).then(function(PromiseResults) {
		PageContext={
			Count: 0,
			Counts: [],
			AddEditCount: 1,
			user: page.bindingContext.user,
			ParkId: ParkId
		};
		PromiseResults.forEach(function(PromiseResult) {
			if (PromiseResult.id) {
				console.log("Document");
				switch(PromiseResult.ref.path.split('/')[0]) {
					case "Parks":
						console.log("Ride doc");
						Ride=PromiseResult.data();
						Ride.Id=PromiseResult.id;
						if (Ride.Logo) {
							Ride.HasLogo=true;
						} else {
							Ride.HasLogo=false;
						};
						PageContext.Ride=Ride;
						break;
					case "Users":
						console.log("Trip doc");
						Trip=PromiseResult.data();
						Trip.Id=PromiseResult.id;
						Trip.DateHuman=moment().format("dddd DD/MM/YYYY");
						PageContext.Trip=Trip;
						break;
					default:
						console.log("Unknown first fragment");
						console.log(PromiseResult.ref.path);
				};
			} else {
				console.log("Collection");
				PromiseResult.forEach(function(Doc) {
					console.log(Doc);
					switch(Doc.ref.path.split('/')[0]) {
						case "Users":
							console.log("Ride count count doc");
							PageContext.Count=PageContext.Count+Doc.data().Count;
							CountDoc=Doc.data();
							CountDoc.Id=Doc.id;
							CountDoc.TimeHuman=moment(Doc.data().Time).format("HH:mm:ss");
							PageContext.Counts.push(CountDoc);
							break;
						default:
							console.log("Unknown first fragment");
							console.log(Doc.ref.path);
					};
				});
			};
		});
		PageContext.PageTitle=`${PageContext.Ride.Name}\n${PageContext.Trip.DateHuman}`;
		console.log(PageContext);
		const vm = fromObject(PageContext);
		page.bindingContext = vm;
	}).catch(function(error) {
		console.log("Ride count get error");
                console.log(error);

		frameModule.topmost().navigate({
			moduleName: "home/home-page",
			backstackVisible: false,
			transition: {
				name: "fade"
			}
		});
		setTimeout(function() {
			feedback.error({
				title: "Unable to load ride count",
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

function AddEditCountAdd() {
	var frame = require('ui/frame');
	var page = frame.topmost().currentPage;
	page.bindingContext.AddEditCount++;
};
function AddEditCountSubtract() {
	var frame = require('ui/frame');
	var page = frame.topmost().currentPage;
	Count=page.bindingContext.AddEditCount;
	Count--;
	page.bindingContext.AddEditCount=Math.max(1,Count);
};
function AddEditCountSave() {
	var frame = require('ui/frame');
	var page = frame.topmost().currentPage;
	Count=page.bindingContext.AddEditCount;
        UserId=page.bindingContext.user.uid;
	RideId=page.bindingContext.Ride.Id;
	ParkId=page.bindingContext.ParkId;
	TripId=page.bindingContext.Trip.Id;
	console.log(`Adding ${Count} rides on ride: ${RideId} for trip: ${TripId} to: ${ParkId} for user: ${UserId}`);
	firebaseApp.firestore().collection("Users").doc(UserId).collection("RideCount").doc(TripId).collection("Rides").doc().set({
		Ride: RideId,
		Count: Count,
		Time: moment().toDate()
	}).then(function() {
		console.log("Server confirmed ride count write");
	}).catch(function(error) {
		console.log("Ride count add error");
                console.log(error);
		setTimeout(function() {
			feedback.error({
				title: "Unable to add ride count",
				message: "Please check your internet connection and try again",
				titleColor: new color.Color("black")
			});
		}, 130);
	});
	console.log("Assuming write succeeded");
        console.log(`Switching to trip: ${TripId} park: ${ParkId}`);
	frameModule.topmost().navigate({
                moduleName: "ridecountCount/ridecountCount-page",
		backstackVisible: false,
                transition: {
                	name: "fade"
                },
                context: {
                	TripId: TripId,
        	        ParkId: ParkId
	        }
        });
	setTimeout(function() {
		feedback.success({
			title: "Added count",
			message: "Saved ride count",
			titleColor: new color.Color("black")
		});
	}, 125);
};

function DeleteTripCount(args) {
	var frame = require('ui/frame');
	var page = frame.topmost().currentPage;
        UserId=page.bindingContext.user.uid;
	TripId=page.bindingContext.Trip.Id;
	RideId=page.bindingContext.Ride.Id;
	ParkId=page.bindingContext.ParkId;

	CountId=args.object.CountId;
	console.log(`Deleting count: ${CountId}`);

	firebaseApp.firestore().collection("Users").doc(UserId).collection("RideCount").doc(TripId).collection("Rides").doc(CountId).delete().then(function() {
		console.log("Server confirmed ride count delete");
	}).catch(function(error) {
		console.log("Ride count delete error");
                console.log(error);
		setTimeout(function() {
			feedback.error({
				title: "Unable to delete ride count",
				message: "Please check your internet connection and try again",
				titleColor: new color.Color("black")
			});
		}, 130);
	});
	console.log("Assuming delete succeeded");
	frameModule.topmost().navigate({
                moduleName: "ridecountCount/ridecountCount-page",
		backstackVisible: false,
                transition: {
                	name: "fade"
                },
                context: {
                	TripId: TripId,
        	        ParkId: ParkId
	        }
        });
	setTimeout(function() {
		feedback.success({
			title: "Removed count",
			message: "Saved ride count",
			titleColor: new color.Color("black")
		});
	}, 125);
};

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump")
AuthenticatedPageState = require("../shared/AuthenticatedPageState")
exports.cmsPage = require("../shared/cmsPage")
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.AddEditCountAdd=AddEditCountAdd;
exports.AddEditCountSubtract=AddEditCountSubtract;
exports.AddEditCountSave=AddEditCountSave;
exports.DeleteTripCount=DeleteTripCount;

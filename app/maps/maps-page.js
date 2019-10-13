const app = require("tns-core-modules/application");
const Observable = require("tns-core-modules/data/observable").Observable;

const MapsViewModel = require("./maps-view-model");
const fromObject = require("tns-core-modules/data/observable").fromObject;

const firebaseApp = require("nativescript-plugin-firebase/app");
firebaseApp.initializeApp();

var FeedbackPlugin = require("nativescript-feedback");
var feedback = new FeedbackPlugin.Feedback();
var color = require("color");

function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new MapsViewModel();

        firebaseApp.firestore().collection("Parks").where("Active","==",true).where("Maps","==",true).orderBy("Name","asc").get().then(querySnapshot => {
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
        	                        title: "Unable to load maps",
                	                message: "Please check your internet connection and try again",
                        	        titleColor: new color.Color("black")
                        	});
			}, 125);
                } else {
                        console.log("Not empty");
			Parks=[];
                        querySnapshot.forEach(doc => {
                                console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
				Park=doc.data();
				Park.id=doc.id;
				Parks.push(Park);
                        });

			console.log(Parks);
			const vm = fromObject({
				Parks: Parks
		    	});
		    	page.bindingContext = vm;
                };
        }).catch(function(error) {
                        console.log("Error fetching parks with maps enabled");
                        console.log(error);
                        frameModule.topmost().navigate({
                                moduleName: "home/home-page",
                                transition: {
                                        name: "fade"
                                }
                        });

			setTimeout(function() {
	                        feedback.error({
        	                        title: "Unable to load maps",
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
                moduleName: "mapsPark/mapsPark-page",
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

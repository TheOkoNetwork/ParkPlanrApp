const {
  Application,
  Color,
  Frame
} = require('@nativescript/core');

const ticketAddViewModel = require("./ticketAdd-view-model");

const firebase = require("@nativescript/firebase").firebase;

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();

async function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new ticketAddViewModel();
  console.log("On navigating to ticket add page");

  const user = await firebase.getCurrentUser()
  console.log("Got user");
  console.log(user);
  if (user['email']) {
	console.log("Prefilling in email field with users email");
	page.bindingContext.set('email', user['email']);
  };
  if (user['phoneNumber']) {
	console.log("Prefilling in phoneNumber field with users phoneNumber");
	page.bindingContext.set('phoneNumber', user['phoneNumber']);
  };
}

function onLoaded (args) {
  AuthenticatedPageState();
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

async function addTickets() {
	console.log("Add tickets clicked");
        const page = Frame.topmost().currentPage;

	const email = page.bindingContext.get('email');
	const phoneNumber = page.bindingContext.get('phoneNumber');
	console.log(`Got ticket fetch request for: ${email} ${phoneNumber}`);

	if (!email) {
		console.log("Email address not provided");
		feedback.error({
        	  title: "We need your email address to fetch your tickets",
        	  titleColor: new Color("black")
        	});
		return;
	};
	if (!phoneNumber) {
		console.log("Phone number not provided");
		feedback.error({
        	  title: "We need your phone number to fetch your tickets",
        	  titleColor: new Color("black")
        	});
		return;
	};

	console.log(`I should now lookup all tickets for email: ${email} and phone number: ${phoneNumber}`);
	try {
		const TicketsLookupByEmailPhone = firebase.functions.httpsCallable("TicketsLookupByEmailPhone");
		const lookupResult = await TicketsLookupByEmailPhone({email: email, phoneNumber: phoneNumber});
		console.log(lookupResult);
		if (lookupResult['status']) {
			console.log("Status is true, got tickets, redirecting to tickets list");
			Frame.topmost().navigate({
          			moduleName: "tickets/tickets-page",
          			transition: {
            				name: "fade"
          			}
        		});
			feedback.success({
          			title: lookupResult['userReason'],
          			titleColor: new Color("black")
        		});
		} else {
			console.log("Status is false, something went wrong, Function returned status false");
			feedback.error({
        			title: lookupResult['userReason'],
        			titleColor: new Color("black")
		        });
		};
	} catch (error) {
		console.log("Got network error looking up tickets");
		console.log(error);
		feedback.error({
       			title: "Sorry something went wrong, please check your connection and try again",
       			titleColor: new Color("black")
	        });
	};
};

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
var AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.addTickets = addTickets;

const {
  Application,
  Color,
  Frame
} = require('@nativescript/core');

const moment = require("moment");

const ticketsViewModal = require("./tickets-view-model");

const firebase = require("@nativescript/firebase").firebase;

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

async function onNavigatingTo (args) {
  console.log("On tickets list page");
  const page = args.object;
  console.log("Got page object");
  page.bindingContext = new ticketsViewModal();
  console.log("Got VM");

  const user = await firebase.getCurrentUser()
  console.log("Got user");
  const uid = user.uid;
  console.log("Got UID");
  console.log(`Looking up tickets for user: ${uid}`);
  //the query is seperate from the .get call
  //to make chaining query params a LOT easier
  const ticketsQuery = firebaseApp.firestore().collection('tickets')
  .where('user', '==', uid)
  .orderBy("orderDate", "desc")

  const ticketDocs = await ticketsQuery.get()
  //strictly speaking what we call a "ticket" is actually an order
  //but functionally speaking each ticket within an order is accessed
  //together so it makes sense to bundle them up here for the list of "tickets"	
  console.log(`Fetched: ${ticketDocs.docs.length} tickets for user`)

  const tickets = [];

  let hasTickets = false;
  ticketDocs.forEach(function (ticketDoc) {
    const ticketData = ticketDoc.data();
    // fid is the ID for this order within firestore
    // not to be confused with orderId which is the merchants order ID
    ticketData.fid = ticketDoc.id;

    let ticketDataLoaded = true;
    if (!ticketData['attractionName']) {
	ticketData['attractionName']="(Ticket loading)";
	ticketDataLoaded = false;
    };

    ticketData['orderDate']=moment(ticketData['orderDate']).format("DD/MM/YYYY");

    //@todo don't set this here and instead let BOH functions handle it
    ticketData['ticketDataLoaded'] = ticketDataLoaded;
    tickets.push(ticketData);
    console.log(ticketData);
    hasTickets = true;
  });

  page.bindingContext.set('tickets', tickets);
  page.bindingContext.set('hasTickets',hasTickets)
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

function openTicket (args) {
 const fid = args.object.fid;
  console.log(`Switching to ticket: ${fid}`);
  Frame.topmost().navigate({
    moduleName: "ticketOrderView/ticketOrderView-page",
    transition: {
      name: "fade"
    },
    context: {
      fid: fid
    }
  });
};

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
const AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.openTicket = openTicket;

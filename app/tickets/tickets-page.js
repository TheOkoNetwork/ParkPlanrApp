const app = require("@nativescript/core/application");

const ticketsViewModal = require("./tickets-view-model");

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

async function onNavigatingTo (args) {
  console.log("On tickets list page");
  const page = args.object;
  console.log("Got page object");
  page.bindingContext = new ticketsViewModal();
  console.log("Got VM");
  
  //todo actually lookup tickets
  const uid = firebaseApp.auth().currentUser.uid;
  console.log(`Looking up tickets for user: ${uid}`);
  //the query is seperate from the .get call
  //to make chaining query params a LOT easier
  const ticketsQuery = firebaseApp.firestore().collection('tickets')
  .where('user', '==', uid)

  const ticketDocs = await ticketsQuery.get()
  //strictly speaking what we call a "ticket" is actually an order
  //but functionally speaking each ticket within an order is accessed
  //together so it makes sense to bundle them up here.
  console.log(`Fetched: ${ticketDocs.docs.length} tickets for user`)

  const tickets = [];

  ticketDocs.forEach(function (ticketDoc) {
    const ticketData = ticketDoc.data();
    ticketData.id = ticketDoc.id;
    tickets.push(ticketData);
    console.log(ticketData);
  });

  page.bindingContext.set('tickets', tickets);
  page.bindingContext.set('hasTickets',Boolean(tickets.length))
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
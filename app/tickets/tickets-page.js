const app = require("@nativescript/core/application");

const ticketsViewModal = require("./tickets-view-model");
const fromObject = require("@nativescript/core/data/observable").fromObject;
const frameModule = require("@nativescript/core/ui/frame");

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();
const color = require("tns-core-modules/color");

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new ticketsViewModal();

  //todo actually lookup tickets
  const uid = firebaseApp.auth().currentUser;
  console.log(`Looking up tickets for user: ${uid}`);
  const ticketsQuery = firebaseApp.firestore().collection('tickets')
  .where('user', '==', uid)

  const ticketDocs = await ticketsQuery.get()
  console.log(`Fetched: ${ticketDocs.docs.length} tickets for user`)

  ticketDocs.forEach(function (ticketDoc) {
    const ticketData = ticketDoc.data();
    ticketData.id = ticketDoc.id;
    console.log(ticketData);
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
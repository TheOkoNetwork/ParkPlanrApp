const {
  Application,
  Color,
  Frame
} = require('@nativescript/core');

const ticketOrderViewViewModel = require("./ticketOrderView-view-model");

const firebase = require("@nativescript/firebase").firebase;

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();

async function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new ticketOrderViewViewModel();

  const fid = page.navigationContext.fid;
  console.log(`On navigating to ticket order view for ticket: ${fid}`);
  //@todo lookup the ticket provided as FID instead of hard coded mock data

  page.bindingContext.set('receiptLogo', "https://dev.parkplanr.app/img/brand/logo_name.png");
  page.bindingContext.set('orderId', "123456789");
  page.bindingContext.set('orderDateTime', "31/12/2021 23:59");
  page.bindingContext.set('orderTotal', "123.99");
}

function onLoaded (args) {
  AuthenticatedPageState();
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
var AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;

const app = require("@nativescript/core/application");
// const Observable = require('@nativescript/core/data/observable').Observable

const DiscountcalculatorViewModel = require("./discountcalculator-view-model");
// const fromObject = require('@nativescript/core/data/observable').fromObject
const Percentages = [20, 10];
function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new DiscountcalculatorViewModel();
}

function onLoaded (args) {
  //  const frameModule = require('@nativescript/core/ui/frame')
  //  const page = frameModule.Frame.topmost().currentPage
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView();
  sideDrawer.showDrawer();
}

function FullPriceSelected () {
  console.log("Full price selected, clearing out discounted price");
  const frameModule = require("@nativescript/core/ui/frame");
  const page = frameModule.Frame.topmost().currentPage;
  page.getViewById("DiscountedPrice").text = "";
  page.getViewById("DiscountedPrice").selected = false;
  page.getViewById("FullPrice").selected = true;
}
function FullPriceReturn () {
  console.log("Full price return, calculating discounted price");
  const frameModule = require("@nativescript/core/ui/frame");
  const page = frameModule.Frame.topmost().currentPage;

  const FullPrice = page.getViewById("FullPrice").text;
  const Percentage = Percentages[page.getViewById("Percentage").selectedIndex];
  const Discount = (FullPrice / 100) * Percentage;
  const DiscountedPrice = FullPrice - Discount;

  page.getViewById("DiscountedPrice").text = DiscountedPrice.toFixed(2);
  console.log(FullPrice);
  console.log(Percentage);
  console.log(Discount);
  console.log(DiscountedPrice);
}
function DiscountedPriceSelected () {
  console.log("Discounted price selected, clearing out full price");

  const frameModule = require("@nativescript/core/ui/frame");
  const page = frameModule.Frame.topmost().currentPage;

  page.getViewById("FullPrice").text = "";
  page.getViewById("DiscountedPrice").selected = true;
  page.getViewById("FullPrice").selected = false;
}
function DiscountedPriceReturn () {
  console.log("Discounted price selected, calculating full price");

  const frameModule = require("@nativescript/core/ui/frame");
  const page = frameModule.Frame.topmost().currentPage;

  const DiscountedPrice = page.getViewById("DiscountedPrice").text;
  const Percentage = Percentages[page.getViewById("Percentage").selectedIndex];
  let FullPrice = DiscountedPrice / ((100 - Percentage) / 100);
  FullPrice = FullPrice.toFixed(2);
  page.getViewById("FullPrice").text = FullPrice;
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
const AuthenticatedPageState = require("../shared/AuthenticatedPageState");
exports.cmsPage = require("../shared/cmsPage");
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.FullPriceSelected = FullPriceSelected;
exports.FullPriceReturn = FullPriceReturn;
exports.DiscountedPriceSelected = DiscountedPriceSelected;
exports.DiscountedPriceReturn = DiscountedPriceReturn;

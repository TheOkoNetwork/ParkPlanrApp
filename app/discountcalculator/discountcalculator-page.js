const app = require("tns-core-modules/application");
const Observable = require("tns-core-modules/data/observable").Observable;

const DiscountcalculatorViewModel = require("./discountcalculator-view-model");
const fromObject = require("tns-core-modules/data/observable").fromObject;
const Percentages=[20,10];
function onNavigatingTo(args) {
    const page = args.object;
    page.bindingContext = new DiscountcalculatorViewModel();
}

function onLoaded(args) {
	frameModule = require("tns-core-modules/ui/frame");
        page=frameModule.topmost().currentPage;
};

function onDrawerButtonTap(args) {
    const sideDrawer = app.getRootView();
    sideDrawer.showDrawer();
}


function FullPriceSelected() {
	console.log("Full price selected, clearing out discounted price");
	frameModule = require("tns-core-modules/ui/frame");
        page=frameModule.topmost().currentPage;
        page.getViewById('DiscountedPrice').text="";
        page.getViewById('DiscountedPrice').selected=false;
        page.getViewById('FullPrice').selected=true;
};
function FullPriceReturn() {
	console.log("Full price return, calculating discounted price");
	frameModule = require("tns-core-modules/ui/frame");
        page=frameModule.topmost().currentPage;
        FullPrice=page.getViewById('FullPrice').text;
        Percentage=Percentages[page.getViewById('Percentage').selectedIndex];
	Discount=(FullPrice/100)*Percentage;
	DiscountedPrice=FullPrice-Discount;
        page.getViewById('DiscountedPrice').text=DiscountedPrice.toFixed(2);
	console.log(FullPrice);
	console.log(Percentage);
	console.log(Discount);
	console.log(DiscountedPrice);

};
function DiscountedPriceSelected() {
	console.log("Discounted price selected, clearing out full price");
	frameModule = require("tns-core-modules/ui/frame");
        page=frameModule.topmost().currentPage;
        page.getViewById('FullPrice').text="";
        page.getViewById('DiscountedPrice').selected=true;
        page.getViewById('FullPrice').selected=false;
};
function DiscountedPriceReturn() {
	console.log("Discounted price selected, calculating full price");
	frameModule = require("tns-core-modules/ui/frame");
        page=frameModule.topmost().currentPage;
        DiscountedPrice=page.getViewById('DiscountedPrice').text;
        Percentage=Percentages[page.getViewById('Percentage').selectedIndex];
	FullPrice=DiscountedPrice/((100-Percentage)/100);
        FullPrice=page.getViewById('FullPrice').text=FullPrice.toFixed(2);
};



exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump")
AuthenticatedPageState = require("../shared/AuthenticatedPageState")
exports.cmsPage = require("../shared/cmsPage")
exports.AuthenticatedPageState = AuthenticatedPageState;
exports.onLoaded = onLoaded;
exports.FullPriceSelected = FullPriceSelected;
exports.FullPriceReturn = FullPriceReturn;
exports.DiscountedPriceSelected = DiscountedPriceSelected;
exports.DiscountedPriceReturn = DiscountedPriceReturn;

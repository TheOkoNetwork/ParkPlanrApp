const application = require("@nativescript/core/application");
const frameModule = require("@nativescript/core/ui/frame");

const AppRootViewModel = require("./app-root-view-model");

function onLoaded (args) {
  const drawerComponent = args.object;
  drawerComponent.bindingContext = new AppRootViewModel();
}

function onNavigationItemTap (args) {
  const component = args.object;
  const componentRoute = component.route;
  const componentTitle = component.title;
  const bindingContext = component.bindingContext;

  bindingContext.set("selectedPage", componentTitle);

  frameModule.Frame.topmost().navigate({
    moduleName: componentRoute,
    transition: {
      name: "fade"
    }
  });

  const drawerComponent = application.getRootView();
  drawerComponent.closeDrawer();
}

exports.onLoaded = onLoaded;
exports.onNavigationItemTap = onNavigationItemTap;
exports.cmsPage = require("../shared/cmsPage");

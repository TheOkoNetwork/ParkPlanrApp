const frameModule = require("@nativescript/core/ui/frame");
const application = require("@nativescript/core/application");

function cmsPage (args) {
  console.log("Switching to CMS page");
  console.log(args);
  frameModule.Frame.topmost().navigate({
    moduleName: "cms/cms-page",
    transition: {
      name: "fade"
    },
    context: {
      slug: args.object.slug
    }
  });
  const drawerComponent = application.getRootView();
  drawerComponent.closeDrawer();
}

module.exports = cmsPage;

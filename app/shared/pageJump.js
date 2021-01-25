const frameModule = require("@nativescript/core/ui/frame");

function pageJump (args) {
  console.log("Page jump");
  console.log(args);
  frameModule.Frame.topmost().navigate({
    moduleName: args.object.route,
    transition: {
      name: "fade"
    }
  });
}

module.exports = pageJump;

const frameModule = require("tns-core-modules/ui/frame");

function pageJump(args) {
    console.log("Page jump");
    console.log(args);
    frameModule.topmost().navigate({
        moduleName: args.object.route,
        transition: {
            name: "fade",
        },
    });
}

module.exports = pageJump;

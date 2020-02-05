const fs = require('fs');
const pkg = require('../package.json');
console.log(`Version from package.json: ${pkg.version}`);

var path = require('path');
var AndroidManifest = require('manifest-android');
const semver = require('semver')

var android = new AndroidManifest();
android.load({ file: path.join(__dirname, "../app/App_Resources/Android/src/main/AndroidManifest.xml") }, function(err){
	if (err) {
		console.log("Error reading manifest");
		console.log(err);
		process.exit(1);
	};

	major=android.version.major;
	minor=android.version.minor;
	patch=android.version.patch;
	CurrentVersionName=`${major}.${major}.${patch}`;
	BuildNumber=Number(process.env.BaseBuildNumber)+Number(process.env.CIRCLE_BUILD_NUM);

	NewVersionCode=`${pkg.version}.${BuildNumber}`;
	console.log(`Updating version from: ${CurrentVersionName} to: ${NewVersionCode}`);
	android.version=NewVersionCode;
	android.save({ file: path.join(__dirname, "../app/App_Resources/Android/src/main/AndroidManifest.xml") }, function(err) {
        	console.log("Updated android manifest version");
		process.exit(0);
	});
})

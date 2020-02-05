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

	console.log(`Updating version from :${versionName} to ${pkg.version}`);


	process.exit(1);
})

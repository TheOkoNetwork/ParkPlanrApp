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
	NewVersionName=semver.inc(CurrentVersionName, 'prerelease', 'alpha');

	console.log(`Updating version from :${versionName} to ${NewVersionName}`);


	process.exit(1);
})

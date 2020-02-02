const fs = require('fs');
const pkg = require('../package.json');
//console.log(pkg);

var path = require('path');
var AndroidManifest = require('manifest-android');

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

	CurrentVersionName=major+"."+.minor+"."+.patch;
	NewPatch=patch+1;
	NewVersionName=major+"."+.minor+"."+.NewPatch;
	console.log(`Updating version from :${versionName} to ${NewVersionName}`);


	process.exit(1);
})

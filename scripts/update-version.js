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
	versionName=android.version.major+"."+android.version.minor+"."+android.version.patch;
	console.log(versionName);


	process.exit(1);
})

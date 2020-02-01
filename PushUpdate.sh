#!/bin/bash
#*********************************
#DO NOT PUT THIS IN A PUBLIC REPO
#*********************************
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $DIR


keystoreName="newokonetwork"
keystorePath="/home/gregory/NativeScriptApps/NewOkoNetwork.keystore"
buildMode="debug"
packageID="uk.org.okonetwork.parkplanr"
syncAppName="ParkPlanr Android"

mandatory="--mandatory"
#mandatory=""

DEVICE="c7qsiQaBVvM:APA91bEvdqCVsp1Y7aeo3Oah8TLHCRQEebRerXY1k7irZn8RFRJHv6GgKlaAJ5t9Pzess5ESQgRAAXepQ4vEusOj2qeGNvSlMcB5O2eUW89llqtNjIopJrrYgdnK3MhK7HvPqSXN5LYd"
KEY="AAAAbgpGSTA:APA91bFG4zCNyuCFiPN0DF4JwsvkNqliK_dkpjEixAqvSX9aXlRWWdZAXj1MYJTAstVnFJE4KjUfLkiz8_0smEOyAjkOQVnKZDptaiRmn7dzxIQpjS_08LMRRTFRS1XeiRTB6yjhMWel"
JSON="
  {
    \"to\": \"$DEVICE\",
    \"data\": {
      \"action\": \"CODE_PUSH_UPDATE\"
    }
  }
"


echo "App update pusher"
if [ "$1" ];then
	echo "Using description from param"
	description=$1
	echo $description
else
	read -p "Deployment message:" description
fi

echo "Adding files to git commit"
git add .
echo "Commiting"
git commit -m "$description"
echo "Pushing"
git push

PackageJSONUpdated="$(diff package.json package.json.lastBinaryUpdate -s)"
if [ "$PackageJSONUpdated" == "Files package.json and package.json.lastBinaryUpdate are identical" ];then
	echo "package.json remains unchanged."

	if [ "$(cat AppResourcesHash)" == "$(./GetAppResourcesHash.sh)" ];then
		echo "App resources folder hash same"
	else
		echo "*** App resources folder changed, binary update required. ***"
		binaryUpdate=true
	fi
else
	echo "*** package.json changed, binary update required. ***"
	binaryUpdate=true
fi

if [ $binaryUpdate ];then
	echo "Binary update required"

	read -p "Edit the app's android and iOS build versions then press enter"

	echo "Removing previous aab"
	#rm app.aab

	read -sp "Keystore password:" keystorePassword
	echo ""

	echo "Clearing project folder"
	#./CleanProjectFolder.sh mute


	echo "Running NPM install"
	npm install

	echo "Preparing android platform"
	#tns prepare android

	echo "Building"
	#tns build android --$buildMode --key-store-path $keystorePath  --key-store-password $keystorePassword --key-store-alias $keystoreName --key-store-alias-password $keystorePassword --aab --copy-to app.aab

	if [ -f "app.aab" ]; then
		echo "App build appears to be successful"

		echo "Signing"
		jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -storepass "$keystorePassword" -keypass "$keystorePassword" -keystore "$keystorePath" app.aab "$keystoreName"

		echo "Uploading to Google Play"
		publish-aab-google-play -k ../api-publish.json -p $packageID -a ./app.aab -t internal

		echo "Copying package.json to package.json.lastBinaryUpdate"
		cp package.json package.json.lastBinaryUpdate

		echo "Storing app resources hash"
		./GetAppResourcesHash.sh > AppResourcesHash
	else
		echo "App build failed"
	fi

	exit
else
	echo "Binary update not required, safe to code deploy"
fi

description="$description $(date '+%D +%T')"
echo "Preparing android platform"
tns prepare android
echo "Pushing update"
nativescript-app-sync release "$syncAppName" android $mandatory --description "$description"
echo "Sending push notification"
curl -X POST  --header "Authorization: key=$KEY"  --Header "Content-Type: application/json" https://fcm.googleapis.com/fcm/send -d "$JSON"


echo "Push attempted"
mpg123 ~/Downloads/skyclad_sound_emergency_alarm_siren_loop.mp3

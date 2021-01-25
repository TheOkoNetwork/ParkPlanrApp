

touch ~/.config/configstore/firebase-tools.json
firebaseToolsUser=$(cat ~/.config/configstore/firebase-tools.json|jq .user.hd)

if [[ $firebaseToolsUser == null ]] || [[ $firebaseToolsUser == "" ]]
then
    echo "Firebase login required";
    returnCode=9999;
    while [ $returnCode != "1" ];do
        firebase 2&>/dev/null
        returnCode=$?
    done
    firebase login
fi

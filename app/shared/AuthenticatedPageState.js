const firebase = require("@nativescript/firebase").firebase;
const AuthenticatedStateService = require("../shared/Authenticated-state-service");

function AuthenticatedPageState () {
  console.log("Checking if authenticated");

  firebase
    .getCurrentUser()
    .then((user) => {
      if (user) {
        // console.log("Authenticated");
        console.log(user);
        // console.log("Updating authenticated state");
        AuthenticatedStateService.getInstance().updateAuthenticatedState(
          user
        );
      } else {
        // console.log("Unauthenticated");
        AuthenticatedStateService.getInstance().updateAuthenticatedState(
          false
        );
      }
    })
    .catch((error) => {
      if (error) {
        console.log("Error getting current user");
        AuthenticatedStateService.getInstance().updateAuthenticatedState(
          false
        );
      }
    });
}

module.exports = AuthenticatedPageState;

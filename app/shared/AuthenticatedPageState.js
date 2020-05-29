const firebase = require('nativescript-plugin-firebase')
const AuthenticatedStateService = require('../shared/Authenticated-state-service')

function AuthenticatedPageState () {
  console.log('Checking if authenticated')

  firebase
    .getCurrentUser()
    .then(function (user) {
      if (user) {
        // console.log("Authenticated");
        // console.log(user);
        // console.log("Updating authenticated state");
        AuthenticatedStateService.getInstance().updateAuthenticatedState(
          user
        )
      } else {
        // console.log("Unauthenticated");
      }
    })
    .catch(function (error) {
      if (error) {
        console.log('Error getting current user')
        AuthenticatedStateService.getInstance().updateAuthenticatedState(
          false
        )
      }
    })
}

module.exports = AuthenticatedPageState

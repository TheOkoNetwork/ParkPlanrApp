const { BehaviorSubject } = require("rxjs");

function AuthenticatedStateService () {
  if (AuthenticatedStateService._instance) {
    throw new Error(
      "Use AuthenticatedStateService.getInstance() instead of new."
    );
  }

  // Observable selectedPage source
  this._AuthenticatedStateSource = new BehaviorSubject(false);

  // Observable selectedPage stream
  this.AuthenticatedState$ = this._AuthenticatedStateSource.asObservable();

  this.updateAuthenticatedState = function (AuthenticatedState) {
    console.log("New authenticated state");
    this._AuthenticatedStateSource.next(AuthenticatedState);
  };
}

AuthenticatedStateService.getInstance = function () {
  return AuthenticatedStateService._instance;
};

AuthenticatedStateService._instance = new AuthenticatedStateService();

module.exports = AuthenticatedStateService;

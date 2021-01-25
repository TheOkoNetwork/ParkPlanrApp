const observableModule = require("@nativescript/core/data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function SigninViewModel () {
  SelectedPageService.getInstance().updateSelectedPage("Signin");

  const viewModel = observableModule.fromObject({
    /* Add your view model properties here */
    Authenticated: false
  });

  return viewModel;
}

module.exports = SigninViewModel;

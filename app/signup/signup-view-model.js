const observableModule = require("tns-core-modules/data/observable");

const SelectedPageService = require("../shared/selected-page-service");

function SignupViewModel() {
    SelectedPageService.getInstance().updateSelectedPage("Signup");

    const viewModel = observableModule.fromObject({
        /* Add your view model properties here */
        Authenticated: false,
    });

    return viewModel;
}

module.exports = SignupViewModel;

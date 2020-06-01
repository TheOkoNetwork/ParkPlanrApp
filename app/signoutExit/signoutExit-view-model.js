const observableModule = require('tns-core-modules/data/observable')

const SelectedPageService = require('../shared/selected-page-service')

function SignoutExitViewModel () {
  SelectedPageService.getInstance().updateSelectedPage('SignoutExit')

  const viewModel = observableModule.fromObject({
    /* Add your view model properties here */
    Authenticated: false,
    user: false
  })

  return viewModel
}

module.exports = SignoutExitViewModel

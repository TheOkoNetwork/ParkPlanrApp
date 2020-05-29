const observableModule = require('tns-core-modules/data/observable')

const SelectedPageService = require('../shared/selected-page-service')

function SignoutViewModel () {
  SelectedPageService.getInstance().updateSelectedPage('Signout')

  const viewModel = observableModule.fromObject({
    /* Add your view model properties here */
    Authenticated: false
  })

  return viewModel
}

module.exports = SignoutViewModel

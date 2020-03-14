const observableModule = require('tns-core-modules/data/observable')

const SelectedPageService = require('../shared/selected-page-service')
const AuthenticatedStateService = require('../shared/Authenticated-state-service')

function AppRootViewModel () {
  const viewModel = observableModule.fromObject({
    selectedPage: '',
    user: false
  })

  SelectedPageService.getInstance().selectedPage$.subscribe((selectedPage) => { viewModel.selectedPage = selectedPage })

  AuthenticatedStateService.getInstance().AuthenticatedState$.subscribe((user) => {
    viewModel.user = user
  })

  return viewModel
}

module.exports = AppRootViewModel

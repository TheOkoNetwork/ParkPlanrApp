const observableModule = require('tns-core-modules/data/observable')

const SelectedPageService = require('../shared/selected-page-service')
const AuthenticatedStateService = require('../shared/Authenticated-state-service')

const appSyncRun = require('../shared/appSyncRun')
const application = require('tns-core-modules/application')

function HomeViewModel () {
  SelectedPageService.getInstance().updateSelectedPage('Home')

  const viewModel = observableModule.fromObject({
    /* Add your view model properties here */
    Authenticated: false,
    user: false
  })

  SelectedPageService.getInstance().selectedPage$.subscribe((selectedPage) => { viewModel.selectedPage = selectedPage })
  AuthenticatedStateService.getInstance().AuthenticatedState$.subscribe((user) => {
    viewModel.user = user
  })

  if (!global.appSyncInit) {
    console.log('App sync has not been ran yet this session')
    global.appSyncInit = true
    global.appSyncAndroidKey = global.DebugMode ? global.appSyncKeys.android.staging : global.appSyncKeys.android.production
    global.appSynciOSKey = global.DebugMode ? global.appSyncKeys.ios.staging : global.appSyncKeys.ios.production
    global.appSyncEnabled = true

    application.on(application.resumeEvent, () => {
      appSyncRun()
    })
    appSyncRun()
  }

  return viewModel
}

module.exports = HomeViewModel

const AppSync = require('nativescript-app-sync').AppSync
const InstallMode = require('nativescript-app-sync').InstallMode
const SyncStatus = require('nativescript-app-sync').SyncStatus
const platform = require('tns-core-modules/platform')

function appSyncRun () {
  if (global.appSyncEnabled) {
    console.log('App sync is enabled')
    AppSync.sync(
      {
        enabledWhenUsingHmr: false,
        deploymentKey: platform.isIOS
          ? global.appSynciOSKey
          : global.appSyncAndroidKey,
        installMode: InstallMode.ON_NEXT_RESTART,
        mandatoryInstallMode: platform.isIOS
          ? InstallMode.ON_NEXT_RESUME
          : InstallMode.IMMEDIATE,
        //                    mandatoryInstallMode: InstallMode.ON_NEXT_RESUME,
        updateDialog: {
          optionalUpdateMessage: 'An update is available',
          updateTitle: 'Please restart the app',
          mandatoryUpdateMessage: 'To continue an update is required',
          optionalIgnoreButtonLabel: 'Later',
          mandatoryContinueButtonLabel: platform.isIOS
            ? 'Exit now'
            : 'Restart now',
          appendReleaseDescription: true
        }
      },
      (syncStatus, updateLabel) => {
        console.log(syncStatus)
        console.log(updateLabel)
        if (syncStatus === SyncStatus.UP_TO_DATE) {
          console.log(
                        `AppSync: no pending updates; you're running the latest version, which is: ${updateLabel}`
          )
        } else if (syncStatus === SyncStatus.UPDATE_INSTALLED) {
          console.log(
                        `AppSync: update (${updateLabel}) installed - it will be activated upon next cold boot`
          )
        }
      }
    )
  } else {
    console.log('App sync is disabled')
  }
}

module.exports = appSyncRun

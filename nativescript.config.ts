import { NativeScriptConfig } from '@nativescript/core'

export default {
  id: 'uk.org.okonetwork.parkplanr',
  appResourcesPath: 'app/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
  },
  useLegacyWorkflow: false,
  appPath: 'app',
} as NativeScriptConfig

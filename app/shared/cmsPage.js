const frameModule = require('tns-core-modules/ui/frame')
const application = require('tns-core-modules/application')

function cmsPage (args) {
  console.log('Switching to CMS page')
  console.log(args)
  frameModule.topmost().navigate({
    moduleName: 'cms/cms-page',
    transition: {
      name: 'fade'
    },
    context: {
      slug: args.object.slug
    }
  })
  const drawerComponent = application.getRootView()
  drawerComponent.closeDrawer()
}

module.exports = cmsPage

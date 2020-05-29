const app = require('tns-core-modules/application')

const CmsViewModel = require('./cms-view-model')
const SelectedPageService = require('../shared/selected-page-service')

const firebaseApp = require('nativescript-plugin-firebase/app')
firebaseApp.initializeApp()

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()

const frameModule = require('tns-core-modules/ui/frame')
var color = require('color')

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new CmsViewModel()
}

function onLoaded (args) {
  const page = args.object
  console.log('Fetching cms page')
  var slug = page.navigationContext.slug

  console.log(`Setting selected page service to: ${slug}`)
  SelectedPageService.getInstance().updateSelectedPage(slug)
  console.log('Set')

  firebaseApp
    .firestore()
    .collection('cmsPages')
    .where('slug', '==', slug)
    .where('public', '==', true)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.docs.length) {
        console.log('Empty')
        frameModule.topmost().navigate({
          moduleName: 'home/home-page',
          transition: {
            name: 'fade'
          }
        })

        feedback.error({
          title: 'Page not found',
          message:
                        'Please check your internet connection and try again',
          titleColor: new color.Color('black')
        })
      } else {
        console.log('Not empty')
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`)

          var cmsPage = doc.data()
          cmsPage.id = doc.id
          cmsPage.content = doc.data().content

          if (typeof cmsPage.content === 'string') {
            cmsPage.content = JSON.parse(cmsPage.content)
          }

          page.getViewById('PageContentsHtmlView').html =
                        cmsPage.content
          page.getViewById('PageTitle').text = cmsPage.title
        })
      }
    })
    .catch(function (error) {
      console.log('Error fetching page document')
      console.log(error)
      frameModule.topmost().navigate({
        moduleName: 'home/home-page',
        transition: {
          name: 'fade'
        }
      })

      feedback.error({
        title: 'Sorry, could not load page',
        message: 'Please check your internet connection and try again',
        titleColor: new color.Color('black')
      })
    })
}

function onDrawerButtonTap (args) {
  const sideDrawer = app.getRootView()
  sideDrawer.showDrawer()
}

exports.onNavigatingTo = onNavigatingTo
exports.onDrawerButtonTap = onDrawerButtonTap
exports.onLoaded = onLoaded
exports.pageJump = require('../shared/pageJump')
exports.cmsPage = require('../shared/cmsPage')

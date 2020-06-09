const app = require('tns-core-modules/application')

const CmsViewModel = require('./cms-view-model')
const SelectedPageService = require('../shared/selected-page-service')

const firebaseApp = require('nativescript-plugin-firebase/app')
firebaseApp.initializeApp()

var FeedbackPlugin = require('nativescript-feedback')
var feedback = new FeedbackPlugin.Feedback()

const frameModule = require('tns-core-modules/ui/frame')
var color = require('color')

const labelModule = require('tns-core-modules/ui/label')
const formattedStringModule = require('tns-core-modules/text/formatted-string')
const spanModule = require('tns-core-modules/text/span')

function onNavigatingTo (args) {
  const page = args.object
  page.bindingContext = new CmsViewModel()

  const container = page.getViewById('container')

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
          cmsPage.rawContent = cmsPage.content

          if (typeof cmsPage.content === 'string') {
            cmsPage.content = JSON.parse(cmsPage.content)
          }

          //          page.getViewById('PageContentsHtmlView').html =
          //                        cmsPage.rawContent
          page.getViewById('PageTitle').text = cmsPage.title

          var formattedStringLabel, labelSpan
          cmsPage.content.blocks.forEach(function (block) {
            switch (block.type) {
              case 'paragraph':
                var paragraphLabel = new labelModule.Label()
                paragraphLabel.textWrap = true

                var paragraphText = block.data.text
                paragraphText = paragraphText.replace(
                  /<br>/g,
                  '\r\n'
                )

                labelSpan = new spanModule.Span()
                labelSpan.text = paragraphText

                formattedStringLabel = new formattedStringModule.FormattedString()
                formattedStringLabel.spans.push(labelSpan)

                paragraphLabel.formattedText = formattedStringLabel

                container.addChild(paragraphLabel)
                break
              case 'header':
                var headerLabel = new labelModule.Label()
                headerLabel.textWrap = true

                var headerText = block.data.text
                headerText = headerText.replace(
                  /<br>/g,
                  '\r\n'
                )

                labelSpan = new spanModule.Span()
                labelSpan.text = headerText
                labelSpan.fontWeight = 500
                switch (block.data.level) {
                  case '1':
                    labelSpan.fontSize = 23
                    break
                  case '2':
                    labelSpan.fontSize = 18
                    break
                  case '3':
                    labelSpan.fontSize = 14
                    break
                  case '4':
                    labelSpan.fontSize = 12
                    break
                  case '5':
                    labelSpan.fontSize = 10
                    break
                  case '6':
                    labelSpan.fontSize = 8
                    break
                }

                formattedStringLabel = new formattedStringModule.FormattedString()
                formattedStringLabel.spans.push(labelSpan)

                headerLabel.formattedText = formattedStringLabel

                container.addChild(headerLabel)
                break
              default:
                console.log(
                                    `Unknown block type: ${block.type}`
                )
            }
          })
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
exports.pageJump = require('../shared/pageJump')
exports.cmsPage = require('../shared/cmsPage')

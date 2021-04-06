const {
  Application,
  Color
} = require('@nativescript/core');
const CmsViewModel = require("./cms-view-model");
const SelectedPageService = require("../shared/selected-page-service");

const firebaseApp = require("@nativescript/firebase/app");
firebaseApp.initializeApp();

const FeedbackPlugin = require("nativescript-feedback");
const feedback = new FeedbackPlugin.Feedback();

const frameModule = require("@nativescript/core/ui/frame");
const labelModule = require("@nativescript/core/ui/label");
const formattedStringModule = require("@nativescript/core/text/formatted-string");
const spanModule = require("@nativescript/core/text/span");
const imageModule = require("@nativescript/core/ui/image");

function onNavigatingTo (args) {
  const page = args.object;
  page.bindingContext = new CmsViewModel();

  const container = page.getViewById("container");

  console.log("Fetching cms page");
  const slug = page.navigationContext.slug;

  console.log(`Setting selected page service to: ${slug}`);
  SelectedPageService.getInstance().updateSelectedPage(slug);
  console.log("Set");

  firebaseApp
    .firestore()
    .collection("cmsPages")
    .where("slug", "==", slug)
    .where("public", "==", true)
    .get()
    .then((querySnapshot) => {
      if (!querySnapshot.docs.length) {
        console.log("Empty");
        frameModule.Frame.topmost().navigate({
          moduleName: "home/home-page",
          transition: {
            name: "fade"
          }
        });

        feedback.error({
          title: "Page not found",
          message:
                        "Please check your internet connection and try again",
          titleColor: new Color("black")
        });
      } else {
        console.log("Not empty");

        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);

          const cmsPage = doc.data();
          cmsPage.id = doc.id;
          cmsPage.content = doc.data().content;
          cmsPage.rawContent = cmsPage.content;

          if (typeof cmsPage.content === "string") {
            cmsPage.content = JSON.parse(cmsPage.content);
          }

          //          page.getViewById('PageContentsHtmlView').html =
          //                        cmsPage.rawContent
          page.getViewById("PageTitle").text = cmsPage.title;

          let formattedStringLabel; let labelSpan;
          cmsPage.content.blocks.forEach((block) => {
            switch (block.type) {
              case "paragraph":
                var paragraphLabel = new labelModule.Label();
                paragraphLabel.textWrap = true;

                var paragraphText = block.data.text;
                paragraphText = paragraphText.replace(
                  /<br>/g,
                  "\r\n"
                );

                labelSpan = new spanModule.Span();
                labelSpan.text = paragraphText;

                formattedStringLabel = new formattedStringModule.FormattedString();
                formattedStringLabel.spans.push(labelSpan);

                paragraphLabel.formattedText = formattedStringLabel;

                container.addChild(paragraphLabel);
                break;
              case "header":
                var headerLabel = new labelModule.Label();
                headerLabel.textWrap = true;

                var headerText = block.data.text;
                headerText = headerText.replace(
                  /<br>/g,
                  "\r\n"
                );

                labelSpan = new spanModule.Span();
                labelSpan.text = headerText;
                labelSpan.fontWeight = "bold";
                switch (block.data.level) {
                  case 1:
                    console.log("H1");
                    labelSpan.fontSize = 23;
                    break;
                  case 2:
                    console.log("H2");
                    labelSpan.fontSize = 18;
                    break;
                  case 3:
                    console.log("H3");
                    labelSpan.fontSize = 14;
                    break;
                  case 4:
                    console.log("H4");
                    labelSpan.fontSize = 12;
                    break;
                  case 5:
                    console.log("H5");
                    labelSpan.fontSize = 10;
                    break;
                  case 6:
                    console.log("H6");
                    labelSpan.fontSize = 8;
                    break;
                }

                formattedStringLabel = new formattedStringModule.FormattedString();
                formattedStringLabel.spans.push(labelSpan);

                headerLabel.formattedText = formattedStringLabel;

                container.addChild(headerLabel);
                break;
              case "image":
                var image = new imageModule.Image();
                var imageUrl = block.data.file.url;
                image.src = imageUrl;
                image.loadMode = "async";
                container.addChild(image);
                break;
              default:
                console.log(
                                    `Unknown block type: ${block.type}`
                );
            }
          });
        });
      }
    })
    .catch((error) => {
      console.log("Error fetching page document");
      console.log(error);
      frameModule.Frame.topmost().navigate({
        moduleName: "home/home-page",
        transition: {
          name: "fade"
        }
      });

      feedback.error({
        title: "Sorry, could not load page",
        message: "Please check your internet connection and try again",
        titleColor: new Color("black")
      });
    });
}

function onDrawerButtonTap (args) {
  const sideDrawer = Application.getRootView();
  sideDrawer.showDrawer();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onDrawerButtonTap = onDrawerButtonTap;
exports.pageJump = require("../shared/pageJump");
exports.cmsPage = require("../shared/cmsPage");

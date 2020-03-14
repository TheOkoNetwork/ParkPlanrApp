const observableModule = require('tns-core-modules/data/observable')
const Observable = require('tns-core-modules/data/observable').Observable

const SelectedPageService = require('../shared/selected-page-service')
const AuthenticatedStateService = require('../shared/Authenticated-state-service')
const Percentages = [20, 10]

function DiscountcalculatorViewModel () {
  SelectedPageService.getInstance().updateSelectedPage('Discountcalculator')

  const viewModel = observableModule.fromObject({
    /* Add your view model properties here */
    Authenticated: false,
    user: false,
    DiscountPercentages: ['20%', '10%'],
    DiscountPercentIndex: 0
  })

  SelectedPageService.getInstance().selectedPage$.subscribe((selectedPage) => { viewModel.selectedPage = selectedPage })
  AuthenticatedStateService.getInstance().AuthenticatedState$.subscribe((user) => {
    viewModel.user = user
  })

  viewModel.addEventListener(Observable.propertyChangeEvent, (args) => {
    if (args.propertyName === 'DiscountPercentIndex') {
      console.log('propertyChangeEvent [value]: ', args.value)
      console.log('propertyChangeEvent [oldValue]: ', args.oldValue)

      const frameModule = require('tns-core-modules/ui/frame')
      const page = frameModule.topmost().currentPage

      var FullPrice
      var Percentage
      var Discount
      var DiscountedPrice

      if (page.getViewById('FullPrice').selected) {
        console.log('Calculating discounted price')
        FullPrice = page.getViewById('FullPrice').text
        Percentage = Percentages[page.getViewById('Percentage').selectedIndex]
        Discount = (FullPrice / 100) * Percentage
        DiscountedPrice = FullPrice - Discount
        page.getViewById('DiscountedPrice').text = DiscountedPrice.toFixed(2)
      } else {
        if (page.getViewById('DiscountedPrice').selected) {
          console.log('Calculating full price')
          DiscountedPrice = page.getViewById('DiscountedPrice').text
          Percentage = Percentages[page.getViewById('Percentage').selectedIndex]
          FullPrice = DiscountedPrice / ((100 - Percentage) / 100)
          FullPrice = page.getViewById('FullPrice').text = FullPrice.toFixed(2)
        } else {
          console.log('No price to calculate')
        };
      };
    };
  })

  return viewModel
}

module.exports = DiscountcalculatorViewModel

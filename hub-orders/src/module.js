import path from 'path'

export default function (moduleOptions) {
  const templates = [
    // Components
    'components/OrderLines.vue',
    'components/AddOrderNote.vue',
    'components/UpdateOrderStatus.vue',
    'components/OrderTransactions.vue',
    'components/OrderDetailsView.vue',
    'components/OrderDetails.vue',
    'components/OrdersSplitView.vue',
    'components/OrdersTableView.vue',
    'components/CreateTransaction.vue',
    'components/RefundTransaction.vue',
    'components/CustomerOrderHistory.vue',
    'components/CustomerReport.vue',
    'components/OrderAverageReport.vue',
    'components/OrderExport.vue',
    'components/OrderHistory.vue',
    'components/MetricBadge.vue',
    'components/OrdersReport.vue',
    'components/BestSellersReport.vue',
    'components/SalesReport.vue',
    'mixins/InteractsWithOrders.js',


    'store/order.js',

    // Translations
    'locales/en.json',
    'locales/fr.json',

    // Pages
    'pages/OrderIndex.vue',
    'pages/OrderDashboard.vue',
    'pages/OrderView.vue',
    'pages/reports/SalesReport.vue',
    'pages/reports/OrdersReport.vue',
    'pages/reports/NewVsReturningCustomers.vue',
    'pages/reports/AvgOrderValue.vue',
    'pages/reports/BestSellers.vue',
  ];

  templates.forEach((template) => {
    this.addTemplate({
      src: path.resolve(__dirname, template),
      fileName: 'orders/' + template
    })
  })

  this.addPlugin(path.resolve(__dirname, 'plugin.js'))
}

module.exports.meta = require('../package.json')

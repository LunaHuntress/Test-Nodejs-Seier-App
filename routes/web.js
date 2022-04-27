const authController = require('../app/http/controllers/authController')
const orderController = require('../app/http/controllers/customers/orderController')
const homeController = require ('../app/http/controllers/homeController')
const purchaseController = require('../app/http/controllers/customers/purchaseController')
const adminPurchaseController = require('../app/http/controllers/admin/purchaseController')
const statusController = require('../app/http/controllers/admin/statusController')


// Middlewares
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const admin = require('../app/http/middleware/admin')

function initRoutes(app) {
    
    app.get('/', homeController().index )

    // req, res) => {
    //     res.render('home')
    // }

    
    //     (req, res) => {
    //     res.render('customers/order')
    // }
    app.get('/login', guest, authController().login )
    app.post('/login', authController().postLogin)

    //     (req, res) => {
    //     res.render('auth/login')
    // }

    app.get('/register', guest, authController().register )
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)

// (req, res) => {
//     res.render('auth/register')
   
// }

    app.get('/order', orderController().index)
    app.post('/update-order', orderController().update)

    // Customer routes aka prodmanager
    app.post('/purchases', auth, purchaseController().store)
    app.get('/customers/purchases', auth, purchaseController().index)
    app.get('/customer/purchases/:id', auth, purchaseController().show)
    

    // Admin routes aka courier
    app.get('/admin/purchases', admin, adminPurchaseController().index)
    app.post('/admin/purchase/status', admin, statusController().update)

  
}

module.exports = initRoutes
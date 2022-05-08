const authController = require('../app/http/controllers/authController')
const orderController = require('../app/http/controllers/customers/orderController')
const homeController = require ('../app/http/controllers/homeController')
const purchaseController = require('../app/http/controllers/customers/purchaseController')
const adminPurchaseController = require('../app/http/controllers/admin/purchaseController')
const statusController = require('../app/http/controllers/admin/statusController')
 const recordController = require('../app/http/controllers/recordController')
const userController = require('../app/http/controllers/userController')
const itemController = require('../app/http/controllers/itemController')
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

    // Item Management

    app.get('/itemManagement', itemController().index)
    app.get('/additem', itemController().form)
    app.post('/additem', itemController().create)

    // Complete Record
    app.get('/completeRecord', recordController().index)
    

    // Customer routes aka prodmanager
    app.post('/purchases', auth, purchaseController().store)
    app.get('/customers/purchases', auth, purchaseController().index)
    app.get('/customer/purchases/:id', auth, purchaseController().show)
    // app.get('/record', auth, purchaseController().display)
   
    

    // Admin routes aka courier
    app.get('/admin/purchases', admin, adminPurchaseController().index)
    app.post('/admin/purchase/status', admin, statusController().update)

    // User Management
   
    
    app.get('/userManagement',  userController().index)
     app.get('/:id',  userController().delete)
     app.get('/edituser/:id',  userController().find)
     app.post('/edituser/:id', userController().update)
    
    
    
    
    
    
    
}

module.exports = initRoutes
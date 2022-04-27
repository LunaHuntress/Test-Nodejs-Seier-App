const Purchase = require('../../../models/purchase')
const moment = require('moment')
function purchaseController () {
    return {
        store(req, res) {
            // Validate request
            // const { phone, address } = req.body
            // if(!phone || !address) {
            //     req.flash('error', 'All fields are required')
            //     return res.redirect('/order')
            // }

            const { customername, address } = req.body
            if(!customername || !address) {
                req.flash('error', 'All fields are required')
                return res.redirect('/order')
            }

            const purchase = new Purchase({
                role: req.user.role,
                prodmanagerId: req.user._id,
                items: req.session.order.items,
                customername,
                address 
            })

            purchase.save().then(result => {
                Purchase.populate(result, { path: 'prodmanagerId'}, (err, placedPurchase) => {
                    req.flash('success', 'Purchase placed successfully')
                    delete req.session.order
                    // Emit
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('purchasePlaced', placedPurchase)
                    return res.redirect('/customers/purchases')
                })
                
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/order')
            })
        },
        async index(req, res) {
             const purchases = await Purchase.find({ prodmanagerId: req.user._id},
                null, 
                { sort: { 'createdAt': -1 } } )
            // res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate,
            // max-stale=0, post-check=0, pre-check=0')
            res.render('customers/purchases', { purchases: purchases, moment: moment })
            // console.log(purchases)
        },
        async show(req, res) {
            const purchase = await Purchase.findById(req.params.id)
            // Authorize user
            if(req.user._id.toString() === purchase.prodmanagerId.toString()) {
               return res.render('customers/singlePurchase', { purchase })
            } 
            res.redirect('/')
        },

        
    }
}

module.exports = purchaseController
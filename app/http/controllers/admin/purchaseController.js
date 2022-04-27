const purchase = require("../../../models/purchase")
const Purchase = require('../../../models/purchase')
function purchaseController() {
    return{
        index(req, res){
            purchase.find({ status: { $ne: 'completed' } },null, { sort: { 'createdAt': -1 }}).
            populate('prodmanagerId', '-password').exec((err, purchases) => {
                if(req.xhr){
                    return res.json(purchases)
                } else {
                res.render('admin/purchases')
                }
            })

        }
    }
}

module.exports = purchaseController
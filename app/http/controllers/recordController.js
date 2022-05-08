const Purchase = require('../../models/purchase')
const moment = require('moment')
function recordController (){
 return {
     async index(req, res){
         const purchases = await Purchase.find({ status: "Delivered"}).sort({
             status: 1,
         })
       return res.render('completeRecord', { purchases: purchases })
     }
 }
}

module.exports = recordController
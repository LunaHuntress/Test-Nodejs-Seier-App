const Purchase = require('../../../models/purchase')

function statusController() {
    return {
         update(req, res) {
             Purchase.updateOne({ _id: req.body.purchaseId }, { status: req.body.status }, (err, data) => {
               if (err) {
                     return res.redirect('/admin/purchases')
                 }
                 // Emit event 
                 const eventEmitter = req.app.get('eventEmitter')
                 eventEmitter.emit('purchaseUpdated', { id: req.body.purchaseId, status: req.body.status })
                 return res.redirect('/admin/purchases')
             })
         }
    }
}

module.exports = statusController

    
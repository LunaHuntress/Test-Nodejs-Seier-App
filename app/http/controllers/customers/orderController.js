function orderController() {
    return {
        index(req, res) {
            res.render('customers/order')
        },
        update(req,res) {
            // let order = {
            //     items: {
            //         trackingId: { item: trackingObject, qty:0 },
            //     },
            //     totalQty: 0,
            // }

            // for the first time creating cart and adding basic object structure
            if(!req.session.order) {
                req.session.order = {
                    items: {},
                    totalQty: 0,
                    // allTotal: 0,
                    // totalMeasurements: 0
                }
                
            }
            const order = req.session.order

            
                // Check if item does not exist in order
                 if(!order.items[req.body._id]) {
                     order.items[req.body._id] = {
                         item: req.body,
                         qty: 1
                     }
                     order.totalQty = order.totalQty + 1
                    //  order.totalMeasurements = req.body.length * req.body.width * req.body.height/61024 
                    //  order.allTotal = order.totalQty * order.totalMeasurements.toFixed(3)
                 } else {
                     order.items[req.body._id].qty = order.items[req.body._id].qty + 1
                     order.totalQty = order.totalQty + 1
                    //  order.totalMeasurements = req.body.length * req.body.width * req.body.height/61024 
                    //  order.allTotal = order.totalQty * order.totalMeasurements.toFixed(3)
                 }


            return res.json({ totalQty: req.session.order.totalQty })
        }
    }
}

module.exports = orderController
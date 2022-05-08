const mongoose = require('mongoose')

const Schema = mongoose.Schema

const purchaseSchema = new Schema({
    prodmanagerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: { type: Object, required: true },
    // allTotal: { type: Number, required: true},
    // materialusage: { type: String, required: true },
    // colors: { type: String, required: true },
    // fabrics: { type: String, required: true },
    //  length: req.body.length,
    //  width: req.body.width,
    //  height: req.body.height,
    purchaseorder: { type: String, required: true },
    customername: { type: String, required: true},
    address: { type: String, required: true},
    // paymentType: { type: String, default: 'COD'}
    status: { type: String, default: 'prepared'}
}, { timestamps: true })

const Purchase = mongoose.model('Purchase', purchaseSchema)

module.exports = Purchase
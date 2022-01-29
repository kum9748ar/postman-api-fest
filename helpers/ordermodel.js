const mongoose = require('mongoose')
const orderSchema = new mongoose.Schema({
    product_id: { type: String, required: true },
    quantity: { type: Number, default: 1 },

})
module.exports = mongoose.model('Order', orderSchema)
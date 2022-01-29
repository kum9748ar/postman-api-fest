const mongoose = require('mongoose')
const product = require('./helpers/productmodel')
const order = require('./helpers/ordermodel')
require('dotenv').config()
const url = process.env.MONGO_URI
const port = process.env.PORT || 8000
mongoose.connect(url, { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('connection successfull ')
    }
    else {
        console.log('error occured' + err)
    }
})


function sendResponse(res, err, data) {
    if (err) {
        res.send({
            success: false,
            message: err
        })
    } else if (data == null) {
        res.send({
            success: false,
            message: "Not Found"
        })
    } else {
        res.send({
            success: true,
            data: data
        })
    }
}
// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

//function 
function getQuantity(id, query) {
    console.log('id is  ' + id)
    product.findById(id).exec((err, data) => {
        var old = data.quantity
        product.findByIdAndUpdate(id, { quantity: old - query }, { new: true }).exec((err, data) => {
            console.log(data)
        })
    })
    return 1
}

fastify.get('/', async (req, res) => {
    res.send("welcome to product inventory")
})
//Get all products
fastify.get('/products', async (req, res) => {
    product.find({}).exec((err, data) => {
        sendResponse(res, err, data)
    })
})
//Add a single  product
fastify.post('/products', async (req, res) => {
    const newProduct = new product(req.body)
    return newProduct.save()
})
//Get single product
fastify.get('/products/:id', async (req, res) => {
    const id = req.params.id
    product.findById(id).exec((err, data) => {
        sendResponse(res, err, data)
    })

})
//Update single product

fastify.put('/products/:id', async (req, res) => {
    const id = req.params.id
    const data = req.body
    const { ...updateData } = data
    product.findByIdAndUpdate(id, data, { new: true }).exec((err, data) => {
        sendResponse(res, err, data)
    })

})
//Delete single product

fastify.delete('/products/:id', async (req, res) => {
    const id = req.params.id
    product.findByIdAndRemove(id).exec((err, data) => {
        res.send({
            "message": data.id + " has been deleted successfully "

        })
    })
})
//get all orders
fastify.get('/orders', async (req, res) => {
    order.find({}).exec((err, data) => {
        sendResponse(res, err, data)
    })
})
//create an order 
fastify.post('/orders/:id', async (req, res) => {
    const id = req.params.id
    const { quantity } = req.query
    //update the product stock 
    const result = getQuantity(id, quantity)
    orderdata = {
        "product_id": id,
        "quantity": quantity
    }
    const newOrder = new order(orderdata)
    return newOrder.save()

    // we will return the order details 
})
// Run the server!
const start = async () => {
    try {
        await fastify.listen(port)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
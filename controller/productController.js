const ProductModel = require('../models/ProductModel')
const fs = require('fs')

// add product
exports.addProduct = async (req, res) => {
    let productToAdd = new ProductModel({
        product_name: req.body.product_name,
        product_price: req.body.product_price,
        product_description: req.body.product_description,
        count_in_stock: req.body.count_in_stock,
        product_image: req.file?.path,
        category: req.body.category
    })
    productToAdd = await productToAdd.save()
    if (!productToAdd) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(productToAdd)
}

// get all products
exports.getAllProducts = async (req, res) => {
    let products = await ProductModel.find().populate('category')
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)
}

// get product details
exports.getProductDetails = async (req, res) => {
    let product = await ProductModel.findById(req.params.id).populate('category')
    if (!product) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(product)
}

// get all products by category
exports.getAllProductsByCategory = async (req, res) => {
    let products = await ProductModel.find({ category: req.params.categoryId })
    if (!products) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(products)
}

// delete product
exports.deleteProduct = (req, res) => {
    ProductModel.findByIdAndDelete(req.params.id)
        .then(deletedProduct => {
            if (!deletedProduct) {
                return res.status(400).json({ error: "Product not found" })
            }
            else {
                if(fs.existsSync(deletedProduct.product_image)){
                    fs.unlinkSync(deletedProduct.product_image)
                }
                res.send({ message: "Product deleted Successfully" })
            }
        })
        .catch(error => {
            return res.status(500).json({ error: error.message })
        })
}

// update product
exports.updateProduct = async (req, res) => {
    // product from db
    let productToUpdate = await ProductModel.findById(req.params.id)
    if (!productToUpdate) {
        return res.status(400).json({ error: "Something went wrong." })
    }
    // handling file update
    if (req.file) {
        if (fs.existsSync(productToUpdate.product_image)) {
            fs.unlinkSync(productToUpdate.product_image)
        }
        productToUpdate.product_image = req.file.path
    }

    // updating data from frontend
    let { product_name, product_description, count_in_stock, product_price, category, rating } = req.body

    productToUpdate.product_name = product_name ? product_name : productToUpdate.product_name
    productToUpdate.product_description = product_description ? product_description : productToUpdate.product_description
    productToUpdate.product_price = product_price ? product_price : productToUpdate.product_price
    productToUpdate.count_in_stock = count_in_stock ? count_in_stock : productToUpdate.count_in_stock
    productToUpdate.category = category ? category : productToUpdate.category
    productToUpdate.rating = rating ? rating : productToUpdate.rating

    productToUpdate = await productToUpdate.save()

    if (!productToUpdate) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(productToUpdate)

    // let productToUpdatee = await ProductModel.findByIdAndUpdate(req.params.id,{
    //     product_name: req.body.product_name,
    //     product_price: req.body.product_price,
    //     product_description: req.body.product_description,
    //     count_in_stock: req.body.count_in_stock,
    //     category: req.body.category,
    //     rating: req.body.rating
    // })
    // if(!productToUpdatee){
    //     return res.status(400).json({error:"Something went wrong"})
    // }
    // res.send(productToUpdatee)
}
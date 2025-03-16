const CategoryModel = require('../models/Category')

// add new category
exports.addCategory = async (req, res) => {
    let categoryExists = await CategoryModel.findOne({ category_name: req.body.category_name })
    if (categoryExists) {
        return res.status(400).json({ error: "Category already exists." })
    }

    let categoryToAdd = await CategoryModel.create({
        category_name: req.body.category_name
    })

    if (!categoryToAdd) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    res.send(categoryToAdd)
}

// get all categories
exports.getAllCategories = async (req, res) => {
    let categories = await CategoryModel.find()
    if (!categories) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(categories)
}

// get category details
exports.getCategoryDetails = async (req, res) => {
    let category = await CategoryModel.findById(req.query.id)
    if (!category) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(category)
}

// update category
exports.updateCategory = async (req, res) => {
    let categoryToUpdate = await CategoryModel.findByIdAndUpdate(req.params.id, {
        category_name: req.body.category_name
    }, { new: true })
    if (!categoryToUpdate) {
        return res.status(400).json({ error: "Something went wrong" })
    }
    res.send(categoryToUpdate)
}


// delete Category
exports.deleteCategory = (req, res) => {
    CategoryModel.findByIdAndDelete(req.params.id)
        .then(deletedCategory => {
            if (!deletedCategory) {
                return res.status(400).json({ error: "Category not found" })
            }
            res.send({ message: "Category deleted successfully" })
        })
}



/*
to get data from user-
    req.body   - receive data using form
    req.params - recieve data using url / profile
    req.query - recieve data using url / search

    res.send(obj) - to send obj to client
    res.json(json_obj) - to send json object to client

    status code - 400 : bad request

    200 : OK (DEFAULT)
    300 : 
    4xx : errors
    400 : bad request
    401 : authentication error
    403 : authorization error
    404 : not found error
    500/600 : server error


    CRUD : 

    Create : Model.create(obj)
    Retrieve:
            Model.find() -> returns all documents in an array
            Model.find(filter) -> returns all documents in an array, that satisfies the filter obj
            Model.findOne(filter) -> returns document that satisfies the filter obj
            Model.findById(id) -> returns the document with the given id
    Update:
            Model.findByIdAndUpdate(id, obj) -> updates the document with given id, sets the values provided in obj

    Delete:
            Model.findByIdAndDelete(id) -> removes the document with the given id

    */
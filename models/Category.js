const mongoose = require('mongoose')

const categorySchema  = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        trim: true
    }
},{timestamps: true})

module.exports = mongoose.model("Category", categorySchema)

// _id - default by mongodb - 24 bit hex string
// {timestamps: true} - provides createdAt, updatedAt fields
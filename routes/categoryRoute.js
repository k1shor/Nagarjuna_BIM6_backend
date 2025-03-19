const { addCategory, getAllCategories, getCategoryDetails, updateCategory, deleteCategory } = require('../controller/categoryController')
const { categoryCheck, validationScript } = require('../middleware/validationfile')

const router = require('express').Router()

router.post(`/addcategory`, categoryCheck, validationScript, addCategory)
router.get('/getallcategories', getAllCategories)
router.get('/getcategorydetails/:id', getCategoryDetails)
router.put('/updatecategory/:id', updateCategory)
router.delete('/deletecategory/:id', deleteCategory)

// router.post('/category', addCategory)
// router.get('/category', getAllCategories)
// router.get('/category/:id', getCategoryDetails)
// router.put('/category/:id', updateCategory)
// router.delete('/category/:id', deleteCategory)

module.exports = router
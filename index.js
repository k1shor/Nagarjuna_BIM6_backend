const express = require('express')
require('dotenv').config()
require('./database/connection')

const cors = require('cors')

const TESTROUTE = require('./routes/testRoute')
const CategoryRoute = require('./routes/categoryRoute')
const ProductRoute = require('./routes/ProductRoute')
const UserRoute = require('./routes/userRoute')


const app = express()
const port = process.env.PORT


app.get('/', (request, response)=>{
    response.send("GOOD MORNING!!!")
})

app.use(express.json())
app.use(cors())

app.use('/public/uploads', express.static('public/uploads'))

app.use(TESTROUTE)
app.use(CategoryRoute)
app.use(ProductRoute)
app.use(UserRoute)


app.listen(port, ()=>{
    console.log(`APP STARTED SUCCESSFULLY AT PORT ${port}`)
})
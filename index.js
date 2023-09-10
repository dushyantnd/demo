const express = require('express')
const app = express()
var bodyParser = require('body-parser')
require('./config/db')
const userRoute = require('./routes/userRoutes')

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/users',userRoute);

app.get('/', function (req, res) {
  res.send('Running')
})

app.listen(5000)
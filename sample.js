const express = require('express')
const app = express()

var path = __dirname + '/views/'
var router = express.Router()

app.use('/', router)

router.get('/')
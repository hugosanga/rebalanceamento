const express = require('express')
const cors = require('cors')

const routes = require('./routes')

app = express()

app.use(cors('http://192.168.0.9:3000'))
app.use(express.json())
app.use(routes)

app.listen(3333)

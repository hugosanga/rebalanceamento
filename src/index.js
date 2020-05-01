const express = require('express')
const cors = require('cors')

const routes = require('./routes')

app = express()

app.use(cors('https://rebalanceamento-frontend.herokuapp.com'))
app.use(express.json())
app.use(routes)

app.listen(process.env.PORT || 3333)

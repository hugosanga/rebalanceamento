const express = require('express')
const cors = require('cors')
// const secure = require('express-force-https')

const routes = require('./routes')

app = express()

app.use(cors({ origin: 'https://rebalanceamento-frontend.herokuapp.com' }))
app.use(express.json())
// app.use(secure)
app.use(routes)

app.listen(process.env.PORT || 3333)

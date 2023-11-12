const express = require('express')
const bodyParser = require('body-parser')
const apiUp = require('./routes/apiup')
const userRouter = require('./routes/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/',apiUp)
app.use('/user', userRouter)

const server = app.listen(port, (err) => {
  if (err) throw err
  console.log("Server listening the port " + port)
})


module.exports = server
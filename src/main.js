const express = require('express')
const bodyParser = require('body-parser')
const apiUp = require('./routes/apiup')
const userRouter = require('./routes/user')
const jwt = require('./auth/jwt')


const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/',apiUp)
app.use('/user',userRouter)
app.get('/authorized',function (req, res) {
  try{
    let value = jwt.getToken(req.headers.token)
    res.status(201).json(value)
  }catch(err){
    res.status(401).json(err)
  }
});

const server = app.listen(port, (err) => {
  if (err) throw err
  console.log("Server listening the port " + port)
})


module.exports = server
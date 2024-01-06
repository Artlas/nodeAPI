const express = require("express");
const bodyParser = require("body-parser");
const apiUp = require("./routes/apiup");
const userRouter = require("./routes/user");
const jwt = require("./auth/jwt");
const NodeRSA = require("node-rsa");
const fs = require("fs");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ['http://localhost:3000','https://staging.fournierfamily.ovh', 'https://fournierfamily.ovh'],
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("/user/connect", cors());
app.post(
  "/user/connect",
  function (req, res, next) {
 
    res.json({ msg: "CORS enabled for /user/connect" });
  }
);
app.get("/", apiUp);
app.use("/user", userRouter);
app.get("/authorized", function (req, res) {
  try {
    let value = jwt.getToken(req.headers.token);
    res.status(201).json(value);
  } catch (err) {
    res.status(401).json(err);
  }
});

if (!fs.existsSync("private.key")) {
  const newkey = new NodeRSA({ b: 512 });
  newkey.generateKeyPair();
  const private = newkey.exportKey("private");
  const public = newkey.exportKey("public");
  fs.writeFileSync("private.key", private);
  fs.writeFileSync("public.key", public);
  console.log("New keys generated!");
}

const server = app.listen(port, (err) => {
  if (err) throw err;
  console.log("Server listening the port " + port);
});

module.exports = server;

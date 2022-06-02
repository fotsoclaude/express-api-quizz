var express = require("express");
const app = require("../app");
var router = express.Router();

function checkCredentials(req, res, next) {
  console.log("User credentials is ......");

  // req.requestTime = Date.now();

  next();
}

router.use(checkCredentials);

/* GET users listing. */
router.get("/", function (req, res, next) {
  console.log("req.requestTime", req.requestTime);
  res.send("respond with a resource: " + req.requestTime);
});

module.exports = router;

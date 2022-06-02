const express = require("express");

const router = express.Router();

class DivisionByZeroError extends Error {
  constructor(message) {
    super(message);
  }
}

class Unauthorize extends Error {
  constructor(message) {
    super(message);
  }
}

router.use((req, res, next) => {
  const auth = req.query.auth;
  if (auth) {
    next();
  } else {
    next(new Unauthorize("Unauthorize"));
  }
});

router.get("/", (req, res) => {
  res.send("Welcome to math services");
});

router.get("/sqrt/:number", (req, res) => {
  const { number } = req.params;
  const result = Math.sqrt(number);
  res.status(200).send(`Sqrt(${number}) = ${result}`);
});

router.get("/power/:number/:power", (req, res) => {
  const { number, power } = req.params;
  const result = Math.pow(number, power);
  res.status(200).send(`${number}^${power} = ${result}`);
});

router.get(
  "/div/:number/:div",
  (req, res, next) => {
    if (req.params.div == 0) {
      next(new DivisionByZeroError("Can't divise a number by zero!"));
    }
    next();
  },
  (req, res) => {
    const { number, div } = req.params;
    const result = number / div;
    res.status(200).send(`${number} / ${div} = ${result}`);
  }
);

router.use((err, req, res, next) => {
  console.log("[Application Error]", err);
  next(err);
});

router.use((err, req, res, next) => {
    if(err instanceof Unauthorize) {
      res.status(403).send(err.message)
    }
    else {
      next(err)
    }
});

router.use((err, req, res, next) => {
  if (err instanceof DivisionByZeroError) {
    res.status(405).send(err.message);
  } else {
    next(err);
  }
});

router.use((err, req, res, next) => {
  res.status(500);
  res.send("Internal server error");
});

router.use((err, req, res) => {});

module.exports = router;
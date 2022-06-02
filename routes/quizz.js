const express = require("express");

const router = express.Router();

class NoCorrespondantQuizz extends Error {
    constructor(message) {
        super(message);
    }
}

class WrongResponse extends Error {
    constructor(message) {
        super(message)
    }
}

class Quizz {
    constructor(id, options, questions, result) {
        this.id = id;
        this.options = options;
        this.questions = questions;
        this.result = result;
    }
}

var quizz1 = new Quizz(1, ["oui", "non"], "Êtes-vous un homme ?", "oui");
var quizz2 = new Quizz(2, ["Jaune", "Rouge"], "Quelle est votre couleur préférée ?", "Jaune");
var quizz3 = new Quizz(3, ["ING3", "ING2"], "Quelle est votre classe ?", "ING3");

quizz_all = [quizz1, quizz2, quizz3]

router.get("/", (req, res) => {
    res.status(200).json(quizz_all);
});

router.get("/play/:questionId", (req, res, next) => {
    const { questionId } = req.params;
    var found = false;

    for (const quizz of quizz_all) {
        if (quizz.id == questionId) {
            found = true
            res.status(200).json(quizz)
        }
    }
    if (!found) {
        next(new NoCorrespondantQuizz("Aucun quizz correspondant !"))
    }
});

router.get("/rest/:questionId/:reponse", (req, res, next) => {
    const { questionId, reponse } = req.params;
    var found = false;

    for (const quizz of quizz_all) {
        if (quizz.id == questionId) {
            found = true
            if (quizz.result == reponse) {
                res.status(200).send("Bonne réponse")
            }
            else {
                next(new WrongResponse("Mauvaise réponse."))
            }
            break
        }
    }
    if (!found) {
        next(new NoCorrespondantQuizz("Aucun quizz correspondant !"))
    }
});

// Gestion du cas où l'utilisateur veut acceder à un quizz qui n'existe pas
router.use((err, req, res, next) => {
    if (err instanceof NoCorrespondantQuizz) {
        res.status(404).send(err.message);
    } else {
        next(err);
    }
});

// Gestion de la mauvaise réponse entrée par l'utilisateur
router.use((err, req, res, next) => {
    if (err instanceof WrongResponse) {
        res.status(406).send(err.message);
    } else {
        next(err);
    }
});

// Gestion de toutes les autres erreurs
router.use((err, req, res, next) => {
    res.status(500);
    res.send("Internal server error");
});

module.exports = router;
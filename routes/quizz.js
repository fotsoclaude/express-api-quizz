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

quizz_all = [
    new Quizz(1, ["oui", "non"], "Êtes-vous un homme ?", "oui"),
    new Quizz(2, ["Jaune", "Rouge"], "Quelle est votre couleur préférée ?", "Jaune"),
    new Quizz(3, ["ING3", "ING2"], "Quelle est votre classe ?", "ING3")
]

router.get("/", (req, res) => {
    const noResult = hideResult();
    res.status(200).json(noResult);
});

router.get("/play/:id", (req, res, next) => {
    const { id } = req.params;
    const noResult = hideResult();
    const quizz = noResult.find((it) => it.id == id);
    
    if (!quizz) {
        next(new NoCorrespondantQuizz("Aucun quizz correspondant !"))
    }

    res.status(200).json(quizz);
});

router.get("/res/:id", (req, res, next) => {
    const { id } = req.params;
    const quizz = quizz_all.find((it) => it.id == id);
    
    if (!quizz) {
        next(new NoCorrespondantQuizz("Aucun quizz correspondant !"))
    }

    res.status(200).json(quizz.result);
});

router.get("/correction/:id/:reponse", (req, res, next) => {
    const { id, reponse } = req.params;
    const quizz = quizz_all.find((it) => it.id == id);

    if (!quizz) {
        next(new NoCorrespondantQuizz("Aucun quizz correspondant !"))
    }

    if (quizz.result == reponse) {
        res.status(200).send("Bonne réponse")
    }
    else {
        next(new WrongResponse("Mauvaise réponse."))
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
    res.status(500).send("Internal server error");
});


function hideResult() {
    const result = [];
    quizz_all.forEach((quizz) => {
        result.push({
        ...quizz,
        result: undefined,
        });
    });
    return result;
}

module.exports = router;
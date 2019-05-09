const express = require('express');
const router = express.Router();
const Errors = require('../errors/Errors');
const handler = require('../typehandlers');
const identifiers = require('../identifiers');
const Attributes = require('../middleware/attributes');
const Constructors = require('../middleware/constructors');
const Functions = require('../middleware/functions');
const Main = require('../middleware/main');

let variables = [];

router.get('/', (req, res, next) => {
    res.render('index', {
        title: 'Java Visualizer'
    });
});

router.post('/', (req, res, next) => {
    const atts = req.body.attributes.replace(/\r|\n/g, '');
    const consts = req.body.constructors.replace(/\r|\n/g, '');
    const funcs = req.body.functions.replace(/\r|\n/g, '');
    const _main = req.body.main.replace(/\r|\n/g, '');

    let attributes = Attributes(atts);
    let constructors = Constructors(consts);
    let functions = Functions(funcs);
    let main = Main(_main, attributes, constructors, functions);
    
    res.json({
        variables,
        attributes,
        constructors,
        functions,
        main
    });
});

module.exports = router;
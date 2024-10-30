const express = require('express');

const router = express.Router();

// Middleware to validate JSON data
function validateJson(req, res, next) {


    // Example validation logic

    if (Object.keys(req.body).length === 0|| typeof req.body !== 'object'||!req.body) {
        res.status(400).json({'estado': false, 'codigo': 238,'descrip':'FORMATO DE JSON INVALIDO'});
   
    }else{
        
        next();
    }


}

router.use(validateJson);

module.exports = router;
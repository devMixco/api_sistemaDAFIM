const express = require('express');

const router = express.Router();

// Middleware to validate JSON data
function validateJson(req, res, next) {
    const body = req.body;
    
    // Example validation logic
    console.log(body === undefined || typeof body !== 'object')
    if (body === undefined ) {
        res.status(400).json({ error: 'JSON INVALIDO' });
   
    }else{
        next();
    }


}

router.use(validateJson);

module.exports = router;
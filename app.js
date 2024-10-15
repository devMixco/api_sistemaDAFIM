'use strict'

var express = require('express');
var bodyParser = require('body-parser')
var app = express();
//var cons = require('./routes/R_Consultas.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", 'Authorization, Origin, X-Requested-With, Content-Type, Accept,access-control-allow-origin');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET');
    next();
});


////////////
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });
app.post('/upload', upload.array('files'), function (req, res, next) {
    const fileNames = req.files.map(file => file.originalname);
    res.json({ files: fileNames });
    console.log('si se guardaron')
});
app.get('/search/:query', function (req, res) {
    const query = req.params.query;
    const dir = './uploads/';
    const files = fs.readdirSync(dir);
    const filteredFiles = files.filter(file => file.startsWith(query));
    res.json(filteredFiles);
});
app.get('/download/:filename', (req, res) => {
    const fileName = req.params.filename;
    const file = ` ./uploads/${fileName}`;
    res.download(file);
    console.log(file)
});

app.get('/view/:filename', (req, res) => {
    const fileName = req.params.filename;
    const file = path.join(__dirname, 'uploads', fileName);
    res.sendFile(file);
    console.log(file);
});

////////////////////////////////////
//app.use(cons);

module.exports = app;

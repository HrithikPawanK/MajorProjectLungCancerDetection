const { response } = require('express');
var express = require('express');
var router = express.Router();
const FormData = require('form-data');
var fs = require('fs');
const multer  = require('multer');
const Patient = require('../model/patient');
const https = require('https')
// const upload = multer({ dest: 'uploads/' })

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});

const axios = require('axios').default;
// const {storage} = require('../cloudinary')
// var upload = multer({ storage });
var upload = multer({storage: fileStorageEngine});

router.use((req, res, next) => {
    if(req.session.user.doctor){
        return res.redirect('/logout');
    }
    next();
})

router.get('/', async (req, res) => {
    const user = req.session.user.data;
    const patient = await Patient.findOne({username : user.username});
    console.log(patient);
    res.render('patient', {data : patient.data});
})

router.get('/addctscan', (req, res) => {
    res.render('patient/addctscan');
})

router.post('/addctscan', upload.single('ctscan'), async (req, res) => {
    const url = 'http://127.0.0.1:5000/predict';
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path));
    const request_config = {
        headers: {
            ...form.getHeaders()
        }
    };
    const response = await axios.post(url, form, request_config); 
    let result = response.data;
    const user = req.session.user.data;
    const patient = await Patient.findOne({username : user.username});
    if(!patient){
        res.redirect('/patient');
    }
    if(result){
        result = "Lung Cancer Detected";
    }else{
        result = "Lung Cancer Not Detected";
    }
    patient.data.push({result, img : req.file.path});
    await patient.save();
    res.redirect('/patient');
})

router.get('/profile', (req, res) => {
    const patient = req.session.user.data;
    res.render('patient/profile', {patient});
})

module.exports = router;
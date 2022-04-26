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



router.get('/', (req, res) => {
    const patient = req.session.user.data;
    const data = patient.data;
    res.render('patient', {data});
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
    console.log(response);
    // const fileStream = fs.createReadStream(`../public/uploads/${req.file.filename}`);
    // const form = new FormData();
    // form.append('file', fileStream, req.file.filename);
    // console.table(req.file);
    // var filepath = `../uploads/${req.file.filename}`;
    // fs.readFile(filepath, async (error, data) => {
    //     if (error) {
    //         console.log(error);
    //         return;
    //     }
    //     const formData = new FormData();
    //     formData.append('file', data, { filepath: filepath, contentType: 'multipart/form-data' });
    //     axios
    //         .post('http://127.0.0.1:5000/predict', formData, { headers: formData.getHeaders() })
    //         .then(resp => {
    //              console.log('File uploaded successfully.');
    //              res.send(resp)
    //         });
    // });
    // res.send('not uploaded')
    // const form = new FormData();
    // const file = req.file;
    // form.append('file', file.buffer, { filename: file.originalname });
    // const response = await axios.post('http://127.0.0.1:5000/predict', form, {
    //     headers: {
    //       ...form.getHeaders(),
    //     },
    // });
    // console.table(response);
    // const response = await axios.post('http://127.0.0.1:5000/predict', formData, {
    //     headers: {
    //         'enctype': 'multipart/form-data',
    //     },
    // });
    // const user = req.session.user.data;
    // const patient = await Patient.findOne({user});
    // patient.data.push({img : req.file.path, result : response});
    // await patient.save();
    // const response = await axios.post('http://127.0.0.1:5000/predict', {data : 'hp'});
    // console.log(response);
    res.send('some thing')
})

router.get('/profile', (req, res) => {
    const patient = req.session.user.data;
    res.render('patient/profile', {patient});
})

module.exports = router;
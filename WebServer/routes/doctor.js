const e = require('express');
var express = require('express');
var router = express.Router();

const Doctor = require('../model/doctor');
const Patient = require('../model/patient');

router.use((req, res, next) => {
    if(!req.session.user.doctor){
        return res.redirect('/logout');
    }
    next();
})

router.get('/', async (req, res) => {
    const user = req.session.user.data;
    const doctor = await Doctor.findOne({"username" : user.username}).populate('patients');
    const patients = doctor.patients;
    res.render('doctor', {patients})
})

router.get('/addpatient', (req, res) => {
    res.render('doctor/addpatient')
})

router.post('/addpatient', async (req, res) => {
    const {username} = req.body;
    const patient = await Patient.findOne({username});
    const user = req.session.user.data;
    const doctor = await Doctor.findOne({username : user.username});
    if(patient) {
        doctor.patients.push(patient);
        await doctor.save();
    }
    res.redirect('/doctor')
})

router.get('/profile', async (req, res) => {
    const user = req.session.user.data;
    const doctor = await Doctor.findOne({username : user.username});
    res.render('doctor/profile', {doctor});
})

router.get('/patient/:username', async (req, res, next) => {
    const user = req.session.user.data;
    const doctor = await Doctor.findOne({username : user.username}).populate('patients');
    console.log(doctor);
    const patient = await Patient.findOne({username : req.params.username});
    console.log(patient);
    const patients = doctor.patients;
    const check = patients.some(obj => {
        if(obj.username === patient.username){
            return true;
        }
        return false;
    })
    if(check){
        return res.render('doctor/patientprofile', {data : patient.data});
    }
    res.redirect('/doctor');
})

module.exports = router;
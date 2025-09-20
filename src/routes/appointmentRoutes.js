const express = require('express');
const router = express.Router();
const { createAppointment, getRequestAppointmentById, getAppointmentByUser, getAppointmentByProvider, getRequestAppointmentByProviderId } = require('@controllers/appointmentController');
const auth = require('@middlewares/authMiddleware');

router.post('/createAppointment', auth('user', 'admin'), createAppointment);
router.get('/getRequestAppointmentById/:id', auth('user'), getRequestAppointmentById);
router.get('/getAppointmentByUser', auth('user'), getAppointmentByUser);
router.get('/getAppointmentByProvider', auth('provider'), getAppointmentByProvider);
router.get('/getRequestAppointmentByProviderId/:id', auth('provider'), getRequestAppointmentByProviderId);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createAppointment, getRequestAppointmentById, getAppointmentByUser } = require('@controllers/appointmentController');
const auth = require('@middlewares/authMiddleware');

router.post('/createAppointment', auth('user', 'admin'), createAppointment);
router.get('/getRequestAppointmentById/:id', auth('user'), getRequestAppointmentById);
router.get('/getAppointmentByUser', auth('user'), getAppointmentByUser);

module.exports = router;
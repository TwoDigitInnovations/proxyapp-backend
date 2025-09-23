const express = require('express');
const router = express.Router();
const { createAppointment, getRequestAppointmentById, getAppointmentByUser, getAppointmentByProvider, getRequestAppointmentByProviderId, updateAppointmentStatusByProvider, getHistoryByUserId, getHistoryByProviderId } = require('@controllers/appointmentController');
const auth = require('@middlewares/authMiddleware');

router.post('/createAppointment', auth('user', 'admin'), createAppointment);
router.get('/getRequestAppointmentById/:id', auth('user'), getRequestAppointmentById);
router.get('/getAppointmentByUser', auth('user'), getAppointmentByUser);
router.get('/getAppointmentByProvider', auth('provider', 'admin'), getAppointmentByProvider);
router.get('/getRequestAppointmentByProviderId/:id', auth('provider'), getRequestAppointmentByProviderId);
router.post('/updateAppointmentStatusByProvider', auth('provider'), updateAppointmentStatusByProvider);
router.get('/getHistoryByUserId/:id', auth('user'), getHistoryByUserId);
router.get('/getHistoryByProviderId/:id', auth('provider'), getHistoryByProviderId);

module.exports = router;
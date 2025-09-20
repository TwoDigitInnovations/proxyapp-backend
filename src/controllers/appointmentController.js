const Appointment = require("@models/appointment");
const response = require("./../responses");
const moment = require("moment");

module.exports = {
    createAppointment: async (req, res) => {
        console.log('AAAAAAA', req?.body)

        try {
            const payload = req?.body || {};
            payload.user = req.user.id;
            const ticketNumber = `${moment().format('DDMMYYHHmmss')}`;
            payload.ticketNumber = ticketNumber;
            let appoint = new Appointment(payload);
            console.log('BBBBBB', payload)
            await appoint.save();
            return response.ok(res, appoint);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getRequestAppointmentById: async (req, res) => {
        try {
            const appoint = await Appointment.findById(req.params.id).populate('service', '-password')
            return response.ok(res, appoint);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getAppointmentByUser: async (req, res) => {
        try {
            const appoint = await Appointment.find({ user: req.user.id }).populate('service', '-password')
            return response.ok(res, appoint);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getAppointmentByProvider: async (req, res) => {
        try {
            const appoint = await Appointment.find({ service: req.user.id }).populate('service', '-password')
            return response.ok(res, appoint);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getRequestAppointmentByProviderId: async (req, res) => {
        try {
            const appoint = await Appointment.findById(req.params.id).populate('service', '-password')
            return response.ok(res, appoint);
        } catch (error) {
            return response.error(res, error);
        }
    },

    updateAppointmentStatusByProvider: async (req, res) => {
        try {
            const payload = req?.body || {};
            let appoint = await Appointment.findByIdAndUpdate(payload?.id, payload, {
                new: true,
                upsert: true,
            });
            return response.ok(res, appoint);
        } catch (error) {
            return response.error(res, error);
        }
    },
};
const Appointment = require("@models/appointment");
const response = require("./../responses");
const moment = require("moment");

module.exports = {
    createAppointment: async (req, res) => {
        // console.log('AAAAAAA', req?.body)

        try {
            const payload = req?.body || {};
            payload.user = req.user.id;
            const ticketNumber = `${moment().format('DDMMYYHHmmss')}`;
            payload.ticketNumber = ticketNumber;
            let appoint = new Appointment(payload);
            // console.log('BBBBBB', payload)
            await appoint.save();
            return response.ok(res, appoint);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getRequestAppointmentById: async (req, res) => {
        try {
            const appoint = await Appointment.findById(req.params.id).populate('service_provider', '-password')
            return response.ok(res, appoint);
        } catch (error) {
            return response.error(res, error);
        }
    },

    getAppointmentByUser: async (req, res) => {
        // console.log("AAAAAAA", req.user.id)
        // try {
        //     const appoint = await Appointment.find({ user: req.user.id }).populate('service_provider', '-password')
        //     return response.ok(res, appoint);
        // } catch (error) {
        //     return response.error(res, error);
        // }

        try {
            let data = {};

            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            const usePagination = !isNaN(limit) && !isNaN(page);

            let query = Appointment.find({ user: req.user.id }).populate('service_provider', '-password');

            if (usePagination) {
                const skip = (page - 1) * limit;
                query = query.skip(skip).limit(limit);
            }

            const appoint = await query.exec();
            if (usePagination) {
                const totalAppointment = await Appointment.countDocuments({ user: req.user.id });
                const totalPages = Math.ceil(totalAppointment / limit);

                return res.status(200).json({
                    status: true,
                    data: appoint,
                    pagination: {
                        totalItems: totalAppointment,
                        totalPages: totalPages,
                        currentPage: page,
                        itemsPerPage: limit,
                    },
                });
            } else {
                return res.status(200).json({
                    status: true,
                    data: appoint,
                });
            }
        } catch (error) {
            return response.error(res, error);
        }
    },

    getAppointmentByProvider: async (req, res) => {
        // console.log("AAAAAAA", req.user.id)
        // try {
        //     const appoint = await Appointment.find({ service_provider: req.user.id, status: 'Pending' }).populate('user', '-password')
        //     return response.ok(res, appoint);
        // } catch (error) {
        //     return response.error(res, error);
        // }

        try {
            let data = {};

            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            const usePagination = !isNaN(limit) && !isNaN(page);

            let query = Appointment.find({ service_provider: req.user.id, status: 'Pending' }).populate('user', '-password')

            if (usePagination) {
                const skip = (page - 1) * limit;
                query = query.skip(skip).limit(limit);
            }

            const appoint = await query.exec();
            if (usePagination) {
                const totalAppointment = await Appointment.countDocuments({ service_provider: req.user.id, status: 'Pending' });
                const totalPages = Math.ceil(totalAppointment / limit);

                return res.status(200).json({
                    status: true,
                    data: appoint,
                    pagination: {
                        totalItems: totalAppointment,
                        totalPages: totalPages,
                        currentPage: page,
                        itemsPerPage: limit,
                    },
                });
            } else {
                return res.status(200).json({
                    status: true,
                    data: appoint,
                });
            }
        } catch (error) {
            return response.error(res, error);
        }
    },

    getRequestAppointmentByProviderId: async (req, res) => {
        try {
            const appoint = await Appointment.findById(req.params.id).populate('service_provider', '-password')
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

    getHistoryByUserId: async (req, res) => {
        // try {
        //     let currentDate = new Date()
        //     const userId = req.params.id;
        //     const appointmentData = await Appointment.find({
        //         user: userId,
        //         full_date: { $lt: currentDate }
        //     }).populate('service_provider', '-password')
        //     return response.ok(res, appointmentData);
        // } catch (error) {
        //     return response.error(res, error);
        // }

        try {
            let data = {};

            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            const usePagination = !isNaN(limit) && !isNaN(page);

            let currentDate = new Date()
            const userId = req.params.id;

            let query = Appointment.find({ user: userId, full_date: { $lt: currentDate } }).populate('service_provider', '-password')

            if (usePagination) {
                const skip = (page - 1) * limit;
                query = query.skip(skip).limit(limit);
            }

            const appoint = await query.exec();
            if (usePagination) {
                const totalAppointment = await Appointment.countDocuments({ user: userId, full_date: { $lt: currentDate } });
                const totalPages = Math.ceil(totalAppointment / limit);

                return res.status(200).json({
                    status: true,
                    data: appoint,
                    pagination: {
                        totalItems: totalAppointment,
                        totalPages: totalPages,
                        currentPage: page,
                        itemsPerPage: limit,
                    },
                });
            } else {
                return res.status(200).json({
                    status: true,
                    data: appoint,
                });
            }
        } catch (error) {
            return response.error(res, error);
        }
    },

    getHistoryByProviderId: async (req, res) => {
        // try {
        //     let currentDate = new Date()
        //     const serviceId = req.params.id;
        //     const appointmentData = await Appointment.find({
        //         service_provider: serviceId,
        //         full_date: { $lt: currentDate }
        //     }).populate('user', '-password')
        //     return response.ok(res, appointmentData);
        // } catch (error) {
        //     return response.error(res, error);
        // }

        try {
            let data = {};

            const limit = parseInt(req.query.limit);
            const page = parseInt(req.query.page);
            const usePagination = !isNaN(limit) && !isNaN(page);

            let currentDate = new Date()
            const serviceId = req.params.id;

            let query = Appointment.find({ service_provider: serviceId, full_date: { $lt: currentDate } }).populate('user', '-password')

            if (usePagination) {
                const skip = (page - 1) * limit;
                query = query.skip(skip).limit(limit);
            }

            const appoint = await query.exec();
            if (usePagination) {
                const totalAppointment = await Appointment.countDocuments({ service_provider: serviceId, full_date: { $lt: currentDate } });
                const totalPages = Math.ceil(totalAppointment / limit);

                return res.status(200).json({
                    status: true,
                    data: appoint,
                    pagination: {
                        totalItems: totalAppointment,
                        totalPages: totalPages,
                        currentPage: page,
                        itemsPerPage: limit,
                    },
                });
            } else {
                return res.status(200).json({
                    status: true,
                    data: appoint,
                });
            }
        } catch (error) {
            return response.error(res, error);
        }
    },

    getVisitorsStatus: async (req, res) => {
        console.log("AAAAAAA", req.user.id)

        try {
            const totalAppoint = await Appointment.countDocuments({ service_provider: req.user.id });
            const pendingAppoint = await Appointment.countDocuments({ service_provider: req.user.id, status: 'Pending' });
            const completedAppoint = await Appointment.countDocuments({ service_provider: req.user.id, status: 'Completed' });
            return response.ok(res, { totalAppoint, pendingAppoint, completedAppoint });
        } catch (error) {
            return response.error(res, error);
        }
    },
};
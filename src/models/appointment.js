'use strict';

const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String
    },
    phone: {
        type: String,
    },
    gender: {
        type: String,
    },
    purpose_of_visit: {
        type: String,
    },
    date: {
        type: Date,
    },
    time: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    service_provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    service_ref: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
    },
    ticketNumber: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        default: 'Pending'
    },
    full_date: {
        type: Date,
    },
}, {
    timestamps: true
});

appointmentSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
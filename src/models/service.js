'use strict';

const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Point"],
        required: true,
    },
    coordinates: {
        type: [Number],
        required: true,
    },
});

const serviceSchema = new mongoose.Schema({
    service_name: {
        type: String,
    },
    service_location: {
        type: pointSchema,
    },
    service_description: {
        type: String,
    },
    service_slot: {
        type: Array
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    address: {
        type: String,
    },
    service_photo: {
        type: Array
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true
});

serviceSchema.set('toJSON', {
    getters: true,
    virtuals: false,
    transform: (doc, ret, options) => {
        delete ret.__v;
        return ret;
    }
});

serviceSchema.index({ service_location: "2dsphere" });

module.exports = mongoose.model('Service', serviceSchema);
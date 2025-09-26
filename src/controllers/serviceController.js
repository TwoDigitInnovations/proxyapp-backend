const Service = require("@models/service");
const response = require("./../responses");
const cloudinary = require('../config/cloudinary');
const { default: mongoose } = require("mongoose");

module.exports = {

    createService: async (req, res) => {
        console.log('AAAAAAA', req?.body)
        let payload = req?.body || {};

        let servicePhotoUrl = [];

        if (req.files.service_photo) {
            const imageFile = req.files.service_photo;
            try {
                await Promise.all(imageFile.map(async (file) => {
                    const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

                    const result = await cloudinary.uploader.upload(base64Image, {
                        folder: 'proxi',
                        resource_type: 'auto',
                        timeout: 60000
                    });
                    servicePhotoUrl.push(result.secure_url)
                }));
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({
                    success: false,
                    message: 'Error uploading image: ' + uploadError.message
                });
            }
        } else {
            // console.log('No image file found in request');
        }

        if (servicePhotoUrl) {
            if (req.body.oldImages) {
                const oldImages = JSON.parse(req.body.oldImages)
                req.body.service_photo = [...oldImages, ...servicePhotoUrl]
            } else {
                req.body.service_photo = [...servicePhotoUrl]
            }

        }

        if (payload.service_location) {
            let d = JSON.parse(payload.service_location)
            payload.service_location = {
                type: 'Point',
                coordinates: [d.lng, d.lat,]
            }
        }

        if (payload.service_slot) {
            let d = JSON.parse(payload.service_slot)
            payload.service_slot = d
        }

        try {
            payload.user = req.user.id;
            let service = new Service(payload);
            console.log('BBBBBB', payload)
            await service.save();
            return response.ok(res, { message: 'Service added successfully' });
        } catch (error) {
            return response.error(res, error);
        }
    },

    getService: async (req, res) => {
        console.log('AAAAAA', req.user.id)
        try {
            let service = await Service.findOne({ user: req.user.id });
            return response.ok(res, service);
        } catch (error) {
            return response.error(res, error);
        }
    },

    updateService: async (req, res) => {
        try {
            const payload = req?.body || {};

            let servicePhotoUrl = [];

            if (req.files.service_photo) {
                const imageFile = req.files.service_photo;
                try {
                    await Promise.all(imageFile.map(async (file) => {
                        const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

                        const result = await cloudinary.uploader.upload(base64Image, {
                            folder: 'proxi',
                            resource_type: 'auto',
                            timeout: 60000
                        });
                        servicePhotoUrl.push(result.secure_url)
                    }));
                } catch (uploadError) {
                    console.error('Cloudinary upload error:', uploadError);
                    return res.status(500).json({
                        success: false,
                        message: 'Error uploading image: ' + uploadError.message
                    });
                }
            } else {
                // console.log('No image file found in request');
            }

            if (servicePhotoUrl) {
                if (req.body.oldImages) {
                    const oldImages = JSON.parse(req.body.oldImages)
                    req.body.service_photo = [...oldImages, ...servicePhotoUrl]
                } else {
                    req.body.service_photo = [...servicePhotoUrl]
                }

            }

            if (payload.service_location) {
                let d = JSON.parse(payload.service_location)
                payload.service_location = {
                    type: 'Point',
                    coordinates: [d.lng, d.lat,]
                }
            }

            if (payload.service_slot) {
                let d = JSON.parse(payload.service_slot)
                payload.service_slot = d
            }

            let service = await Service.findByIdAndUpdate(payload?.id, payload, {
                new: true,
                upsert: true,
            });
            return response.ok(res, service);
        } catch (error) {
            return response.error(res, error);
        }
    },

    deleteService: async (req, res) => {
        try {
            await Service.findByIdAndDelete(req?.params?.id);
            return response.ok(res, { meaasge: "Deleted successfully" });
        } catch (error) {
            return response.error(res, error);
        }
    },

    nearMeServicebyCategory: async (req, res) => {
        const id = new mongoose.Types.ObjectId(req.body.category);
        try {
            let service = await Service.aggregate([

                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: req.body.location
                        },
                        distanceField: 'location', // The name of the field to store the calculated 
                        maxDistance: 1609.34 * 5, // The maximum distance in meters
                        spherical: true, // Use spherical geometry for accurate distance calculation
                        key: 'service_location'// The indexed field to query against
                    }
                },
                {
                    $match: { category: id, }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user',
                        pipeline: [
                            {
                                $match: { status: "Verified", isAvailable: true }
                            },
                            {
                                $project: {
                                    "name": 1,
                                    "profile": 1,
                                    "phone": 1
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: '$user'
                }

            ]);
            return response.ok(res, service);
        } catch (error) {
            return response.error(res, error);
        }
    },

};
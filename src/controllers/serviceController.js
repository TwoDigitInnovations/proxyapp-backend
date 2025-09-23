const Service = require("@models/service");
const response = require("./../responses");
const cloudinary = require('../config/cloudinary');

module.exports = {

    createService: async (req, res) => {
        console.log('AAAAAAA', req?.body)

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
            const payload = req?.body || {};
            payload.posted_by = req.user.id;
            let service = new Service(payload);
            console.log('BBBBBB', payload)
            await service.save();
            return response.ok(res, { message: 'Service added successfully' });
        } catch (error) {
            return response.error(res, error);
        }
    },

    // updateService: async (req, res) => {
    //     try {
    //         const payload = req?.body || {};

    //         let servicePhotoUrl = [];

    //         if (req.files.service_photo) {
    //             const imageFile = req.files.service_photo;
    //             try {
    //                 await Promise.all(imageFile.map(async (file) => {
    //                     const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

    //                     const result = await cloudinary.uploader.upload(base64Image, {
    //                         folder: 'proxi',
    //                         resource_type: 'auto',
    //                         timeout: 60000
    //                     });
    //                     servicePhotoUrl.push(result.secure_url)
    //                 }));
    //             } catch (uploadError) {
    //                 console.error('Cloudinary upload error:', uploadError);
    //                 return res.status(500).json({
    //                     success: false,
    //                     message: 'Error uploading image: ' + uploadError.message
    //                 });
    //             }
    //         } else {
    //             // console.log('No image file found in request');
    //         }

    //         if (servicePhotoUrl) {
    //             if (req.body.oldImages) {
    //                 const oldImages = JSON.parse(req.body.oldImages)
    //                 req.body.service_photo = [...oldImages, ...servicePhotoUrl]
    //             } else {
    //                 req.body.service_photo = [...servicePhotoUrl]
    //             }

    //         }

    //         if (payload.service_location) {
    //             let d = JSON.parse(payload.service_location)
    //             payload.service_location = {
    //                 type: 'Point',
    //                 coordinates: [d.lng, d.lat,]
    //             }
    //         }

    //         if (payload.service_slot) {
    //             let d = JSON.parse(payload.service_slot)
    //             payload.service_slot = d
    //         }

    //         let service = await Service.findByIdAndUpdate(payload?.id, payload, {
    //             new: true,
    //             upsert: true,
    //         });
    //         return response.ok(res, service);
    //     } catch (error) {
    //         return response.error(res, error);
    //     }
    // },

    // deleteService: async (req, res) => {
    //     try {
    //         await Service.findByIdAndDelete(req?.params?.id);
    //         return response.ok(res, { meaasge: "Deleted successfully" });
    //     } catch (error) {
    //         return response.error(res, error);
    //     }
    // },

};
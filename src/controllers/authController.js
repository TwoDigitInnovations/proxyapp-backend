const User = require('@models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require("./../responses");
const userHelper = require("./../helper/user");
const Verification = require("@models/verification");
const cloudinary = require('../config/cloudinary');

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password, phone, role } = req.body;

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: 'Password must be at least 8 characters long' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,

      });
      if (role) {
        newUser.role = role
      }
      await newUser.save();

      const userResponse = await User.findById(newUser._id).select('-password');

      res
        .status(201)
        .json({ message: 'User registered successfully', user: userResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  sendOTP: async (req, res) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({ email });

      if (!user) {
        return response.badReq(res, { message: "Email does nots exist." });
      }

      // let ran_otp = Math.floor(1000 + Math.random() * 9000);

      // await mailNotification.sendOTPmail({
      //   email: email,
      //   code: ran_otp,
      // });

      let ran_otp = "0000";
      let ver = new Verification({
        user: user._id,
        otp: ran_otp,
        expiration_at: userHelper.getDatewithAddedMinutes(5),
      });

      await ver.save();

      let token = await userHelper.encode(ver._id);

      return response.ok(res, { message: "OTP sent.", token });
    } catch (error) {
      return response.error(res, error);
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const otp = req.body.otp;
      const token = req.body.token;
      if (!(otp && token)) {
        return response.badReq(res, { message: "OTP and token required." });
      }
      let verId = await userHelper.decode(token);
      let ver = await Verification.findById(verId);
      if (
        otp == ver.otp &&
        !ver.verified &&
        new Date().getTime() < new Date(ver.expiration_at).getTime()
      ) {
        let token = await userHelper.encode(
          ver._id + ":" + userHelper.getDatewithAddedMinutes(5).getTime()
        );
        ver.verified = true;
        await ver.save();
        return response.ok(res, { message: "OTP verified", token });
      } else {
        return response.notFound(res, { message: "Invalid OTP" });
      }
    } catch (error) {
      return response.error(res, error);
    }
  },

  changePassword: async (req, res) => {
    try {
      const token = req.body.token;
      const password = req.body.password;
      const data = await userHelper.decode(token);
      const [verID, date] = data.split(":");
      if (new Date().getTime() > new Date(date).getTime()) {
        return response.forbidden(res, { message: "Session expired." });
      }
      let otp = await Verification.findById(verID);
      if (!otp.verified) {
        return response.forbidden(res, { message: "unAuthorize" });
      }
      let user = await User.findById(otp.user);
      if (!user) {
        return response.forbidden(res, { message: "unAuthorize" });
      }
      await Verification.findByIdAndDelete(verID);
      user.password = user.encryptPassword(password);
      await user.save();
      // mailNotification.passwordChange({ email: user.email });
      return response.ok(res, { message: "Password changed! Login now." });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getProfile: async (req, res) => {
    try {
      const u = await User.findById(req.user.id, '-password');
      return response.ok(res, u);
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateProfile: async (req, res) => {
    const payload = req.body;
    const userId = req?.body?.userId || req.user.id;

    let profileUrl = null;
    let documentUrl = [];

    if (req.files.profile) {
      const imageFile = req.files.profile[0];

      try {
        const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(base64Image, {
          folder: 'proxi',
          resource_type: 'auto',
          timeout: 60000
        });
        payload.profile = result.secure_url;
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

    if (req.files.document) {
      const imageFile = req.files.document;
      try {
        await Promise.all(imageFile.map(async (file) => {
          const base64Image = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

          const result = await cloudinary.uploader.upload(base64Image, {
            folder: 'proxi',
            resource_type: 'auto',
            timeout: 60000
          });
          documentUrl.push(result.secure_url)
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

    if (documentUrl) {
      if (req.body.oldImages) {
        const oldImages = JSON.parse(req.body.oldImages)
        req.body.document = [...oldImages, ...documentUrl]
      } else {
        req.body.document = [...documentUrl]
      }

    }

    // if (payload.service_location) {
    //   let d = JSON.parse(payload.service_location)
    //   payload.service_location = {
    //     type: 'Point',
    //     coordinates: [d.lng, d.lat,]
    //   }
    // }

    // if (payload.service_slot) {
    //   let d = JSON.parse(payload.service_slot)
    //   payload.service_slot = d
    // }

    try {
      const u = await User.findByIdAndUpdate(
        userId,
        { $set: payload },
        {
          new: true,
          upsert: true,
        }
      );
      const token = jwt.sign({ id: u._id, email: u.email, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

      // let token = await new jwtService().createJwtToken({
      //   id: u._id,
      //   type: u.type,
      // });
      const data = {
        token,
        ...u._doc,
      };
      delete data.password;
      return response.ok(res, data);
    } catch (error) {
      return response.error(res, error);
    }
  },

  fileUpload: async (req, res) => {
    try {
      let key = req.file && req.file.key;
      return response.ok(res, {
        message: "File uploaded.",
        file: `${process.env.ASSET_ROOT}/${key}`,
      });
    } catch (error) {
      return response.error(res, error);
    }
  },

  getProvider: async (req, res) => {
    console.log('AAAAAAA', req)
    try {
      const u = await User.find({ role: 'provider' }, '-password');
      console.log('AAAAAAA', u)
      return response.ok(res, u);
    } catch (error) {
      return response.error(res, error);
    }
  },

  updateVerifyandSuspendStatus: async (req, res) => {
    try {
      const payload = req?.body || {};
      let product = await User.findByIdAndUpdate(payload?.id, payload, {
        new: true,
        upsert: true,
      });
      return response.ok(res, product);
    } catch (error) {
      return response.error(res, error);
    }
  },

  nearMeServicebyCategory: async (req, res) => {
    const id = req.body.category;
    console.log(id)
    try {
      let orders = await User.find({
        status: "Verified",
        category: id,
        service_location: {
          $near: {
            $maxDistance: 1609.34 * 5,
            $geometry: {
              type: "Point",
              coordinates: req.body.location,
            },
          },
        },
      }, '-password')
      return response.ok(res, orders);
    } catch (err) {
      return response.error(res, err);
    }
  },

};

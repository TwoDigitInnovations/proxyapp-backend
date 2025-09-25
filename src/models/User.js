const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

// const pointSchema = new mongoose.Schema({
//   type: {
//     type: String,
//     enum: ["Point"],
//     required: true,
//   },
//   coordinates: {
//     type: [Number],
//     required: true,
//   },
// });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    phone: {
      type: String,
    },
    profile: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'provider', 'admin'],
      default: 'user',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    document: {
      type: Array
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Suspended'],
      default: 'Pending'
      // default: 'Suspended'
    },
    // service_name: {
    //   type: String,
    // },
    // service_location: {
    //   type: pointSchema,
    // },
    // service_description: {
    //   type: String,
    // },
    // service_slot: {
    //   type: Array
    // },
    // category: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Category",
    // },
    // address: {
    //   type: String,
    // },
    isAvailable: {
      type: Boolean,
      default: true
    },
    about_us: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.methods.isPasswordMatch = async function (password) {
  return password === this.password;
};

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
userSchema.index({ service_location: "2dsphere" });

const User = mongoose.model('User', userSchema);

module.exports = User;

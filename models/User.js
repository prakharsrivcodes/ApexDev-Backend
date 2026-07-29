const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
    type: String,
    // enum = the only allowed values for this field, anything else gets rejected
    enum: ['jobSeeker', 'recruiter', 'admin'],
    // default value if no role is sent during registration
    default: 'jobSeeker',
},
  },
  {
    timestamps: true,
  }
);

// Mongoose 9 me pre-save hooks 'next' callback support nahi karte.
// Ab bas plain async function likhna hota hai — jab function poora
// execute ho jata hai (ya returned promise resolve ho jaata hai),
// Mongoose khud samajh jaata hai ki hook complete ho gaya, aur aage badh jaata hai.
userSchema.pre('save', async function () {
  // 'this' abhi bhi current document ko refer karta hai, jaisa pehle tha.
  if (!this.isModified('password')) {
    return; // bas function se return kar do — 'next()' call karne ki zaroorat nahi
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // Function yahan khatam ho jata hai, koi next() nahi chahiye.
  // Mongoose await karta hai is poori async function ke complete hone ka.
});

const User = mongoose.model('User', userSchema);
module.exports = User;
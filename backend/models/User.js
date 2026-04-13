const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  phone: { type: String, trim: true },
  profileImage: { type: String, default: '' },
  bio: { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
  location: { type: String, trim: true },
  occupation: { type: String, trim: true },
  gender: { type: String, enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say', ''] },
  interests: [{ type: String }],
  verificationLevel: { type: Number, default: 0, min: 0, max: 3 },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastSeen: { type: Date, default: () => Date.now() },
  googleId: { type: String, default: null },
  emailOTP: { type: String, select: false },
  emailOTPExpiry: { type: Date, select: false }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

const mongoose = require('../db');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    referralCode: { type: String, default: uuidv4 },
    referredBy: String,
    referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    rewardPoints: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

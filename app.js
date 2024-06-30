const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User');

const app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('referrals');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});
app.post('/register', async (req, res) => {
    try {
        const { name, email, referralCode } = req.body;
        let referredByUser = null;

        if (referralCode) {
            referredByUser = await User.findOne({ referralCode });
            if (!referredByUser) {
                return res.status(400).send('Invalid referral code');
            }
        }

        const newUser = new User({ name, email, referredBy: referralCode });
        if (referredByUser) {
            referredByUser.referrals.push(newUser._id);
            referredByUser.rewardPoints += 10; // Add reward points for the referrer
            await referredByUser.save();
        }

        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

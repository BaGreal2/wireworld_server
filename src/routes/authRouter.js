const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const schemaValidate = require('../middlewares/schemaValidate');
const authValidator = require('../validationSchemas/authValidator');
const authMiddleware = require('../middlewares/authMiddleware');

const generateAccessToken = (id, username) => {
	const payload = {
		id,
		username,
	};
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

router.post(
	'/registration',
	schemaValidate(authValidator.create),
	async (req, res) => {
		try {
			const { email, username, password } = req.body;
			const candidate_username = await User.findOne({ username });

			const candidate_email = await User.findOne({ email });
			if (candidate_username || candidate_email) {
				return res.status(500).json({ message: 'User is already registered!' });
			}
			const hashPassword = bcrypt.hashSync(password, 7);
			const user = new User({ email, username, password: hashPassword });
			await user.save();
			const token = generateAccessToken(user._id, user.username);
			return res.json({ user, token });
		} catch (error) {
			console.log(error);
			res.status(500).send(error);
		}
	}
);
router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(500).json({ message: `User ${username} not found!` });
		}
		const validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword) {
			return res.status(500).send({ message: `Wrong password!` });
		}
		const token = generateAccessToken(user._id, user.username);
		return res.json({ user, token });
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});
router.get('/me', authMiddleware, async (req, res) => {
	try {
		const token = req.headers.authorization;
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const buff = Buffer.from(base64, 'base64');
		const payloadinit = buff.toString('ascii');
		const payload = JSON.parse(payloadinit);
		const username = payload.username;
		const user = await User.findOne({ username });
		res.json(user);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

module.exports = router;

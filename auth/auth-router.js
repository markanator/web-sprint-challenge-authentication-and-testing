const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('./auth-model');

const router = express.Router();

router.post('/register', validateRegBod(), async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = Users.findBy({ username }).first();

		if (user && user.username !== undefined) {
			console.log(user.username);
			return res.status(409).json({
				message: 'Username is already taken',
			});
		}

		const newUser = await Users.add({
			username,
			password: await bcrypt.hash(password, 14),
		});

		const token = makeToken(newUser);

		res.status(201).json({ newUser, token });
	} catch (err) {
		next(err);
	}
});

router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username }).first();

		if (!user) {
			return res.status(401).json({
				message: 'Invalid Credentials',
			});
		}

		// hash the password again and see if it matches what we have in the database
		const passwordValid = await bcrypt.compare(password, user.password);

		if (!passwordValid) {
			return res.status(401).json({
				message: 'Invalid Credentials',
			});
		}

		const token = makeToken(user);

		res.json({
			token,
			message: `Welcome ${user.username}!`,
		});
	} catch (err) {
		next(err);
	}
});

function makeToken(user) {
	return jwt.sign(
		{
			userID: user.ID,
			isLogged: true,
		},
		process.env.JWT_SECRET
	);
}
function validateRegBod() {
	return (req, res, next) => {
		if (!req.body) {
			return res.status(400).json({
				message: 'Missing Content',
			});
		} else if (!req.body.username || !req.body.password) {
			return res.status(400).json({
				message: 'Missing Required Content',
			});
		} else {
			return next();
		}
	};
}

module.exports = router;

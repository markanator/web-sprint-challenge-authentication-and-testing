/*
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	const authError = {
		message: 'Invalid credentials',
	};
	try {
		const token = req.headers.authorization;
		if (!token) {
			return res.status(401).json(authError);
		}

		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return res.status(401).json(authError);
			}
			// we know the user is authorized at this point
			req.token = decoded;
			return next();
		});
	} catch (err) {
		next(err);
	}
};

const { validationResult  } = require('express-validator');

const handleErrors = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const firstError = errors.array()[0];
		return res.status(400).json({ error: `${firstError.param}: ${firstError.msg}` });
	}
	next();
};

module.exports = handleErrors;
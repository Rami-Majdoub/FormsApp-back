const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');

const User = require("../models/user-model");
const handleErrors = require("../middlewares/handle-errors");

router.post("/register",
	body('email').isEmail(),
	body('password').isLength({ min: 6 }),
	body('role').isIn(['admin', 'user']),
	handleErrors,

	async (req, res) => {
		// check user
		const email = req.body.email.toLowerCase();
		const savedUser = await User.findOne({ email });
		if (savedUser) return res.status(404).send({ error: "email is used" });

		// hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		// create a new user
		const user = new User({
			email: email,
			password: hashedPassword,
			role: req.body.role,
		});

		// save user
		try {
			await user.save();
			res.status(200).send({ message: "account created" });
		} catch (err) {
			res.status(500).send({ message: "failed creating an account", params: err });
		}
	}
);

router.post("/login",
	body('email').isEmail(),
	body('password').isLength({ min: 6 }),
	handleErrors,

	async (req, res) => {
		// check user
		const email = req.body.email.toLowerCase();
		const user = await User.findOne({ email });
		if (!user) return res.status(400).send({ message: "wrong email or password" });

		// password
		const login = await bcrypt.compare(req.body.password, user.password);
		if (!login) return res.status(400).send({ message: "wrong email or password" });

		// create a token
		const payload = {
			_id: user._id
		};
		const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '6h' });
		return res.status(200).send({
				token,
				role: user.role,
		});
	}
);

module.exports = router;
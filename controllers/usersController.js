const Users = require('../models/usersModel');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt-nodejs');



const registerUser = async (req, res) => {
    try {

            const { name, email, password} = req.body;

            console.log(req.body);
            console.log(req.file);

            await check('name', 'Name is required').not().isEmpty().run(req);
            await check('email', 'Email is required').not().isEmpty().run(req);
            await check('email', 'Invalid email').isEmail().run(req);
            await check('password', 'Password is required').not().isEmpty().run(req);
            await check('password', 'Password must be at least 6 characters').isLength({ min: 6 }).run(req);
            

            const validationErrors = validationResult(req);
            if (!validationErrors.isEmpty()) {
                const errorMessages = validationErrors.array().map(error => error.msg);
                return res.status(400).json({ errors: errorMessages });
            }

            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const newUser = new Users({
                name,
                email,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                registerDate: Date.now(),
            });

            try {
                await newUser.validate();
            } catch (error) {
                const errorMessages = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({ errors: errorMessages });
            }

            try {
                const savedUser = await newUser.save();
                return res.status(200).json({ user: savedUser});
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};








const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }


        return res.status(200).json({ message: 'Login successful', user: { ...user.toObject()} });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = { registerUser, loginUser };
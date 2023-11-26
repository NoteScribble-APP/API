const Users = require('../models/usersModel');
const Notes = require('../models/notesModel');
const Events = require('../models/calendarModel');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt-nodejs');



const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;


        await check('name', 'El Nombre es obligatorio').not().isEmpty().run(req);
        await check('email', 'El Correo es obligatorio').not().isEmpty().run(req);
        await check('email', 'Correo no valido').isEmail().run(req);
        await check('password', 'La Contrase;a es obligatoria').not().isEmpty().run(req);
        await check('password', 'La contrase;a debe contener mas de 6 caracteres').isLength({ min: 6 }).run(req);


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
            return res.status(200).json({ user: savedUser });
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
        console.log(req.body.eventos)
        console.log(req.body.email)
        console.log(req.body.password)
        
        const { email, password } = req.body;

        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // notas
        const notasUsuario = await Notes.find({ idUser: user.id });
        const nuevasNotas = (req.body.notas || []).filter(nuevaNota => {
            return !notasUsuario.some(dbNota => dbNota.id2 === nuevaNota.id2);
        });
        nuevasNotas.forEach(nuevaNota => {
            nuevaNota.idUser = user.id;
        });
        if (nuevasNotas.length > 0) {
            await Notes.insertMany(nuevasNotas);
        }
        const notasActualizadas = await Notes.find({ idUser: user.id });
        // notas
        // eventos
        const eventosUsuario = await Events.find({ idUser: user.id });
        const eventosNuevos = (req.body.eventos || []).filter(nuevoEvento => {
            return !eventosUsuario.some(dbNota => dbNota.id2 === nuevoEvento.id2);
        });
        eventosNuevos.forEach(nuevoEvento => {
            nuevoEvento.idUser = user.id;
        });
        if (eventosNuevos.length > 0) {
            await Events.insertMany(eventosNuevos);
        }
        const eventosActualizados = await Events.find({ idUser: user.id });
        // eventos
        return res.status(200).json({
            message: 'Login successful',
            user: { ...user.toObject() },
            notas: notasActualizadas,
            eventos: eventosActualizados
        });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};





module.exports = { registerUser, loginUser };
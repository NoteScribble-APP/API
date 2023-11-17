const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const notesController = require('../controllers/notesController');

router.get('/', (req, res) => {
    res.send('Hello World');
});
//Ruta usuarios 
router.post('/users/register', usersController.registerUser);
router.post('/users/login', usersController.loginUser);


//Ruta notas
router.get('/notes/:userId', notesController.allNotes);
router.post('/notes', notesController.newNote);
router.put('/notes/:notaId', notesController.editNote);
router.delete('/notes/:notaId', notesController.deleteNote);


module.exports = router;  
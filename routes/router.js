const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const notesController = require('../controllers/notesController');
const calendarController = require('../controllers/calendarController');

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


//Ruta eventos
router.get('/events/:userId', calendarController.allEvents);
router.post('/events', calendarController.newEvent);
router.put('/events/:eventId', calendarController.editEvent);
router.delete('/events/:eventId', calendarController.deleteEvent);


module.exports = router;  
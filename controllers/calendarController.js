const Events = require('../models/calendarModel');

const newEvent = async (req, res) => {
    try {
        console.log(req.body)
        const nuevoEvento = new Events(req.body);
        console.log(nuevoEvento.id2)
        const eventos = await Events.find({ id2: nuevoEvento.id2 });
        console.log(eventos.length >= 1)
        if (eventos.length >= 1) {
            return res.status(200).json({ message: 'Evento existente' });
        }

        const resultado = await nuevoEvento.save();
        res.status(201).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la Evento' });
    }
};

const allEvents = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId)
        const eventos = await Events.find({ idUser: userId });
        console.log(eventos)
        res.status(200).json(eventos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las eventos' });
    }
};

const editEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const actualizacion = req.body;
        console.log(actualizacion)
        console.log(eventId)
        const resultado = await Events.findByIdAndUpdate(eventId, actualizacion, { new: true });
        res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la evento' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        console.log(eventId);
        const resultado = await Events.findByIdAndDelete(eventId);
        console.log(resultado);
        if (resultado) {
            res.status(200).json({ message: 'Evento eliminado correctamente' });
        }
        return res.status(404).json({ message: 'La Evento no existente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la Evento' });
    }
};

module.exports = { newEvent, deleteEvent, editEvent, allEvents };

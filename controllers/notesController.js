const Notes = require('../models/notesModel');

const newNote = async (req, res) => {
    try {
        const nuevaNota = new Notes(req.body);
        console.log(nuevaNota.id2)
        const notas = await Notes.find({ id2: nuevaNota.id2 });
        console.log(notas.length >= 1)
        if (notas.length >= 1) {
            return res.status(200).json({ message: 'Nota existente' });
        }

        const resultado = await nuevaNota.save();
        res.status(201).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la nota' });
    }
};

const allNotes = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId)
        const notas = await Notes.find({ idUser: userId });
        console.log(notas)
        res.status(200).json(notas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las notas' });
    }
};

const editNote = async (req, res) => {
    try {
        const notaId = req.params.notaId;
        const actualizacion = req.body;
        console.log(actualizacion)
        console.log(notaId)
        const resultado = await Notes.findByIdAndUpdate(notaId, actualizacion, { new: true });
        res.status(200).json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la nota' });
    }
};

const deleteNote = async (req, res) => {
    try {
        const notaId = req.params.notaId;
        console.log(notaId);
        const resultado = await Notes.findByIdAndDelete(notaId);
        console.log(resultado);
        if (resultado) {
            res.status(200).json({ message: 'Nota eliminada correctamente' });
        }
        return res.status(404).json({ message: 'La nota no existente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la nota' });
    }
};

module.exports = { newNote, deleteNote, editNote, allNotes };

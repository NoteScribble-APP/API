const { Schema, model } = require('mongoose');

const noteSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    idUser: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    id2: {
        type: Number,
        required: true
    }
});

module.exports = model('Notes', noteSchema, 'notes');

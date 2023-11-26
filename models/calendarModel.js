const { Schema, model } = require('mongoose');

const calendarSchema = new Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    id2: { type: Number, required: true, unique: true },
    idUser: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    notificationTime: { type: String, required: true }
});

module.exports = model('Calendar', calendarSchema, 'calendar');

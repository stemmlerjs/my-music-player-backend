var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SongSchema = Schema({
    artist: { type: String, required: true, index: { unique: false }},
    title: { type: String, required: true, index: { unique: false }},
    album: { type: String, required: true, index: { unique: false }},
    composer: String,
    genre: String,
    recording_time: String,
    track: Number,
    year: String,
    image: Object,
    path: { type: String, required: true, index: { unique: true }}
})


module.exports = mongoose.model('Song', SongSchema)
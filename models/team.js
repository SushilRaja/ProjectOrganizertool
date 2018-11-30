let mongoose = require('mongoose');

// Team Schema
let teamSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    member1:{
        type: String
    },
    member2:{
        type: String
    },
    body:{
        type: String,
        required: true
    }
});

let Team = module.exports = mongoose.model('Team', teamSchema);

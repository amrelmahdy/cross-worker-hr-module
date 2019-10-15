const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const benefitScheme = new Schema({
    title: String,
    image: {
        type: String,
        default: "/public/dist/img/placeholder.png",
    },

    description: String,

    created_at: {
        type: Date,
        default: Date.now()
    },

});

benefitScheme.index({'$**': 'text'});


const Benefit = mongoose.model('Benefit', benefitScheme);
module.exports = Benefit;
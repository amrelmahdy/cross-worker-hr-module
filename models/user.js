const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcryptjs = require("bcryptjs");


const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        index: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String
    },
    mobile: String,
    image: {
        type: String,
        default: "/public/dist/img/placeholder.png",
    },

    role: {
        type: Number,
        default: 0 // employee by default
    },

    department: String,

    manager: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    created_at: {
        type: Date,
        default: Date.now()
    },

});

const User = mongoose.model('User', userSchema);
module.exports = User;


module.exports.saveUser =  (newUser, callback) => {
    bcryptjs.genSalt(10, (err, salt) =>  {
        bcryptjs.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};


module.exports.getUserById = function (id, callback) {
    let user = User.findById(id, callback);
};



module.exports.getUserByEmail = (email, callback) => {
    let user = User.findOne({email: email}, callback);
};

module.exports.verifyPassword = (password, hash, callback) => {
    bcryptjs.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
};
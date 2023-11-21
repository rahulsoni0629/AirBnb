const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        require:true,
    }
    // not  need to define username and password as 
    // they are auto. define my passport-local-mongoose
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
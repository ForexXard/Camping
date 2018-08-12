var mongoose = require("mongoose"),
    pasportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(pasportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
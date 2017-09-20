const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const SALT_FACTOR = 10;
const passwordSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true}
});

const emptyFunction = () => {

}

passwordSchema.pre('save', (done) => {
    let user = this;
    console.log(this);
})
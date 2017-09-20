const request = require('request');
const passwordGen = require('password-generator');
const recast = require('recastai');
const fs = require('fs');
const multer = require('multer');
const crypto = require('cryptojs').Crypto;
const bcrypt = require('bcrypt-nodejs');
const pass = passwordGen(30, false);
const mongoose = require('mongoose');
console.log("PASSWORD IS: ", pass);
//const encrypted = crypto.AES.encrypt(pass, "anna");
    //const decrypted = crypto.AES.decrypt(encrypted,"anna");   
   // console.log("ENCRYPTED STUFF: ", encrypted);
   // console.log("DECRYPTED STUFF: ", decrypted);
mongoose.connect('mongodb://localhost:27017/passbot', function(err, res){
    if (err){
        console.log("Error connecting to mongodb");
    } else if (!err){
        console.log("CONNECTING TO MONGODB ON localhost:27017.....CONNECTED!! ");
    }
});
var passSchema = mongoose.Schema({
    username: {type: String, required: true},
    generatedPassword: [{type: String, required: true}],
    ownKey: {type: String, required: true}

});

 const schema = mongoose.model("PssOne", passSchema);

// var mySavedPass = new schema({
//     username: "ayomide",
//     generatedPassword: pass,
//     ownKey: "type",
//     encryptedPassword: encrypted
// });

// mySavedPass.save();


var generatePassword = require("password-generator");

var maxLength = 18;
var minLength = 12;
var uppercaseMinCount = 3;
var lowercaseMinCount = 3;
var numberMinCount = 2;
var specialMinCount = 2;
var UPPERCASE_RE = /([A-Z])/g;
var LOWERCASE_RE = /([a-z])/g;
var NUMBER_RE = /([\d])/g;
var SPECIAL_CHAR_RE = /([\?\-])/g;
var NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;

function isStrongEnough(password) {
 var uc = password.match(UPPERCASE_RE);
 var lc = password.match(LOWERCASE_RE);
 var n = password.match(NUMBER_RE);
 var sc = password.match(SPECIAL_CHAR_RE);
 var nr = password.match(NON_REPEATING_CHAR_RE);
 return password.length >= minLength &&
   !nr &&
   uc && uc.length >= uppercaseMinCount &&
   lc && lc.length >= lowercaseMinCount &&
   n && n.length >= numberMinCount &&
   sc && sc.length >= specialMinCount;
}

function customPassword() {
 var password = "";
 var randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
 while (!isStrongEnough(password)) {
   password = generatePassword(randomLength, false, /[\w\d\?\-]/);
 }
 return password;
}
const passKK = customPassword();

console.log(customPassword());

schema.findOne({
    username: "ayomide"
}, (err, resp) => {
    if (err) {
        console.error("WE HAVE A PROBLEM!!");
    } else if (!err) {
        console.log(`I GOT IT!:::: ${resp}`);
    }
    const passwordFile = fs.createWriteStream('./passwords/passwords.txt', "UTF-8");
    let written = passwordFile.write(passKK, (err, res) => {
        if (err) {
            console.log("ERROR WRITING TO THE FILE.")
        } else if (!err) {
            console.log("Written and saved");
        }
    });
    passwordFile.end()
});

var mySavedPass = new schema({
        username: "ayomide",
        generatedPassword: passKK,
        ownKey: "type" 
    });
    
    mySavedPass.save();

 
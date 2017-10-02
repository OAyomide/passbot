const request = require('request');
const passwordGen = require('password-generator');
const recast = require('recastai');
const fs = require('fs');
const multer = require('multer');
const crypto = require('cryptojs').Crypto;
const bcrypt = require('bcrypt-nodejs');
const pass = passwordGen(30, false);
const mongoose = require('mongoose');
const moment = require('moment')
console.log("PASSWORD IS: ", pass);
//const encrypted = crypto.AES.encrypt(pass, "anna");
    //const decrypted = crypto.AES.decrypt(encrypted,"anna");   
   // console.log("ENCRYPTED STUFF: ", encrypted);
   // console.log("DECRYPTED STUFF: ", decrypted);
mongoose.connect('mongodb://localhost:27017/passbot', function(err, res){
    if (err){
        console.log("Error connecting to mongodb");
        console.log("===============================");console.log("===============================");console.log("===============================");
        console.log(err.message);
        console.log("===============================");
        console.log("===============================");
    } else if (!err){
        console.log("CONNECTING TO MONGODB ON localhost:27017.....CONNECTED!! ");
    }
});
var passSchema = mongoose.Schema({
    username: {type: String, required: true},
    generatedPassword: [{type: String, required: true}],
    ownKey: {type: String, required: true},
    file: {type: String},
    userId: {type: Number,}

});

 const schema = mongoose.model("UsersOne", passSchema);

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
const passwordFile = fs.createWriteStream(`./passwords/passwords${02}.txt`,{
    flags: 'a'
});
var passDir = passwordFile.path
// schema.findOne({
//     username: "ayomide"
// }, (err, resp) => {
//     if (err) {
//         console.error("WE HAVE A PROBLEM!!");
//     } else if (!) {
//         console.log(`I GOT IT!:::: ${resp}`);
//     }
    
//     // let time = moment().format('MMMM Do YYYY, h:mm:ss a')
//     // passwordFile.write(`\nTime: ${time}`)
//     // let breakIt = passwordFile.write('\n====================\n')
//     // let written = new Promise((resolve, reject) => {
//     //     passwordFile.write(passKK+'\n', (err, res) => {
//     //        resolve(res);
//     //        reject(err);
//     //     }
//     // )
//     // }).then((resp) => console.log("Written and Saved")).catch((error)=>console.log("Error writing")) 
//     // passwordFile.end();
//     fs.readFile(passDir, (err, data)=>{
//         if (err) throw err
//             console.log(`Written file is: ${data}`)
//     })
//     console.log(`Directory is: ${passDir}`)
// });

var mySavedPass = new schema({
        username: "ayomide",
        generatedPassword: passKK,
        ownKey: "type",
        file: passDir 
    });
    new Promise((resolve,reject) => {
        schema.findOne({
            username: "eyomide"
        }, (err,res) =>{
            resolve(res)
            reject(err)
        })     
    }).then((response) =>{
        if (response) {
            
            let time = moment().format('MMMM Do YYYY, h:mm:ss a')
            passwordFile.write(`\nTime: ${time}`)
            let breakIt = passwordFile.write('\n====================\n')
            let written = new Promise((resolve, reject) => {
                passwordFile.write(passKK+'\n', (err, res) => {
                   resolve(res);
                   reject(err);
                }
            )
            }).then((resp) => console.log("Written and Saved")).catch((error)=>console.log("Error writing")) 
            passwordFile.end();
            return console.log("USER EXISTS")
        } else {
            
            let time = moment().format('MMMM Do YYYY, h:mm:ss a')
            passwordFile.write(`\nTime: ${time}`)
            let breakIt = passwordFile.write('\n====================\n')
            let written = new Promise((resolve, reject) => {
                passwordFile.write(customPassword()+'\n', (err, res) => {
                   resolve(res);
                   reject(err);
                }
            )
            }).then((resp) => console.log("Written and Saved")).catch((error)=>console.log("Error writing")) 
            passwordFile.end();
            mySavedPass.save();
            console.log("SAVING.....SAVED");
        }
        fs.readFile(passDir, (err, data)=>{
            if (err) throw err
                console.log(`Written file is: ${data}`)
        })
        console.log(`Directory is: ${passDir}`)
    }).catch((err)=>console.log(err))
    

 
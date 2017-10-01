const fs = require('fs');
const mongoose = require('mongoose');
const moment = require('moment')
mongoose.connect('mongodb://admin:asdfghjkl@ds157964.mlab.com:57964/passbot', function(err, res){
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
  userId: {type:Number , required:true},
  file: {type: String}

});

const schema = mongoose.model("PssOne", passSchema);

module.exports = function strong(bp) {
    bp.hear(/QUICKREPLY.B3|QUICKREPLYFAST.B3/, (event, next) => {
        let generatePassword = require("password-generator");
        
        let maxLength = 18;
        let minLength = 12;
        let uppercaseMinCount = 3;
        let lowercaseMinCount = 3;
        let numberMinCount = 2;
        let specialMinCount = 2;
        let UPPERCASE_RE = /([A-Z])/g;
        let LOWERCASE_RE = /([a-z])/g;
        let NUMBER_RE = /([\d])/g;
        let SPECIAL_CHAR_RE = /([\?\-])/g;
        let NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;
        
        function isStrongEnough(password) {
         let uc = password.match(UPPERCASE_RE);
         let lc = password.match(LOWERCASE_RE);
         let n = password.match(NUMBER_RE);
         let sc = password.match(SPECIAL_CHAR_RE);
         let nr = password.match(NON_REPEATING_CHAR_RE);
         return password.length >= minLength &&
           !nr &&
           uc && uc.length >= uppercaseMinCount &&
           lc && lc.length >= lowercaseMinCount &&
           n && n.length >= numberMinCount &&
           sc && sc.length >= specialMinCount;
        }
        
        function customPassword() {
         let password = "";
         let randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
         while (!isStrongEnough(password)) {
           password = generatePassword(randomLength, false, /[\w\d\?\-]/);
         }
         return password;
        }
        
        console.log(customPassword());
        bp.messenger.sendText(event.user.id, `Your custom password is:`);
        bp.messenger.sendText(event.user.id, `${customPassword()}`);
        event.reply('#passwordActionText');
        event.reply('#quickReply');

        var mySavedPass = new schema({
          username: `${event.user.first_name} ${event.user.last_name}`,
          userId: `${event.user.id}`,
          file: passDir 
      });
      new Promise((resolve,reject) => {
          schema.findOne({
            username: `${event.user.first_name} ${event.user.last_name}`
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
                  passwordFile.write(customPassword()+'\n', (err, res) => {
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

      });


}
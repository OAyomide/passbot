const request = require('request'); 
const fs = require('fs');
//import fs from 'fs'
const path = require('path');
const recast = require('recastai');
const bcrypt = require('bcrypt-nodejs');
const inLoop = require('botpress-hitl');
const crypto = require('cryptojs').Crypto;
const customPass = require ('./passwords/customPassword');
const strongPass = require('./passwords/strongPassword');
const mongoose = require('mongoose');
const test = require('./sample')
const moment = require('moment');
// console.log(passwordGen(30, false));
const passwordGen = require('password-generator');

// mongoose.connect('mongodb://admin:asdfghjkl@ds157964.mlab.com:57964/passbot', function(err, res){
//   if (err){
//       console.log("Error connecting to mongodb");
//       console.log("===============================");console.log("===============================");console.log("===============================");
//       console.log(err.message);
//       console.log("===============================");
//       console.log("===============================");
//   } else if (!err){
//       console.log("CONNECTING TO MONGODB ON localhost:27017.....CONNECTED!! ");
//   }
// });
// var passSchema = mongoose.Schema({
//   username: {type: String, required: true},
//   userId: {type: Number, required:true}
// });

// const schema = mongoose.model("firstTest", passSchema);
module.exports = function(bp) {
  // Listens for a first message (this is a Regex)
  // GET_STARTED is the first message you get on Facebook Messenger
  bp.hear(/GET_STARTED|hello|hi|test|hey|holla/i, (event, next) => {
    event.reply('#welcome'); // See the file `content.yml` to see the block
    event.reply('#quickReplyFast');
test()
    // new Promise((resolve,reject) => {
    //         schema.findOne({
    //           username: `${event.user.first_name} ${event.user.last_name}`
    //         }, (err,res) =>{
    //             resolve(res)
    //             reject(err)
    //         })     
    //     }).then((response) =>{
    //         if (response) {
    //             return console.log("USER EXISTS")
    //         } else {
    //           var mySavedPass = new schema({
    //             username: `${event.user.first_name} ${event.user.last_name}`,
    //             userId: `${event.user.id}`
    //         });
    //             mySavedPass.save();
    //             console.log("SAVING.....SAVED");
    //         }
    //       })
    
  })

  // You can also pass a matcher object to better filter events
  bp.hear({
    type: /message|text/i,
    text: /exit|bye|goodbye|quit|done|leave|stop/i
  }, (event, next) => {
    event.reply('#goodbye', {
      // You can pass data to the UMM bloc!
      reason: 'unknown'
    })
  });
  bp.hear({
    type: /multimedia|image/i,
  }, (event, next) => {
    console.log('====================')
    console.log('====================')
    console.log('Event stuffs is: ', event)
    event.reply('#goodbye', {
      // You can pass data to the UMM bloc!
      reason: 'unknown'
    })
    const type = 'image'
    const url = event.raw.payload.url
    bp.messenger.sendAttachment(event.user.id, type, url)
  });
  /**
   * User clicks on Generate password. We want to generate
   * TODO: HASH PASSWORD
   *       VERIFY USER
   *     DONE===>  ASK USER FOR PASSWORD PROPERTIES (REMEMBRABLE, LENGTH, ETC);
   *       SAVE TO LOG FILE, FOR USER TO BE ABLE TO RETRIEVE
   */
   bp.hear(/QUICKREPLY.B1|QUICKREPLYFAST.B1/, (event, next) => {
     const generatePassword = passwordGen(7, true);
     bp.messenger.sendText(generatePassword);
     try {
      const encrypted = crypto.AES.encrypt(generatePassword, "anna");
      const decrypted = crypto.AES.decrypt(encrypted,"anna");   
      console.log("ENCRYPTED STUFF: ", encrypted);
      console.log("DECRYPTED STUFF: ", decrypted);
  bp.messenger.sendText(event.user.id, `Here is a simple password I generated for you:`);
  bp.messenger.sendText(event.user.id, generatePassword)
  event.reply('#passwordActionText');
  event.reply('#quickReply');
  } catch (e) {
      console.log("THE ENCRYPTION KEY IS WRONG!!");
      bp.messenger.sendText(event.user.id, generatePassword);
  }
   });
customPass(bp);
/**
 * we need a custom password
 */
strongPass(bp);
/**
 * WE FOUND A PREVIOUS CONVO
 */
bp.hear('STOP_CONVO', (event, next) => {
  const convo = bp.convo.find(event) 
  if (convo) {
    convo.stop('aborted')
  }
  event.reply('#quickReply')
});
  }

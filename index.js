const request = require('request'); 
const fs = require('fs');
const path = require('path');
const passwordGen = require('password-generator');
const recast = require('recastai');
const bcrypt = require('bcrypt-nodejs');
const inLoop = require('botpress-hitl');
const crypto = require('cryptojs').Crypto;
console.log(passwordGen(30, false));

module.exports = function(bp) {
  // Listens for a first message (this is a Regex)
  // GET_STARTED is the first message you get on Facebook Messenger
  bp.hear(/GET_STARTED|hello|hi|test|hey|holla/i, (event, next) => {
    //event.reply('#welcome'); // See the file `content.yml` to see the block
    event.reply('#quickReply');
    console.log('==============================');
    console.log('=====================================');
    console.log('==================================');
    console.log(`THE EVENTS STUFF IS: ${event.text}`);
    console.log('===================================');
    console.log('================================');
    console.log('=================================')
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

  /**
   * User clicks on Generate password. We want to generate
   * TODO: HASH PASSWORD
   *       VERIFY USER
   *       ASK USER FOR PASSWORD PROPERTIES (REMEMBRABLE, LENGTH, ETC);
   *       SAVE TO LOG FILE, FOR USER TO BE ABLE TO RETRIEVE
   */

   bp.hear('QUICKREPLY.B1', (event, next) => {
     const generatePassword = passwordGen(30, false);
     bp.messenger.sendText(generatePassword);
     try {
      const encrypted = crypto.AES.encrypt(generatePassword, "anna");
      const decrypted = crypto.AES.decrypt(encrypted,"anna");   
      console.log("ENCRYPTED STUFF: ", encrypted);
      console.log("DECRYPTED STUFF: ", decrypted);
  bp.messenger.sendText(event.user.id, "Your password has been encrypted.");
  } catch (e) {
      console.log("THE ENCRYPTION KEY IS WRONG!!");
      bp.messenger.sendText(event.user.id, "The encryption key is wrong");
  }
   });



// bp.hear('QUICKREPLY.B2', (event, next) => {
//   const 
// })

bp.hear('QUICKREPLY.B3', (event, next) => {
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
  
  console.log(customPassword());
  bp.messenger.sendText(event.user.id, `Your custom password is: ${customPassword()}`);
})


  


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

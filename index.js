const request = require('request'); 
const fs = require('fs');
const path = require('path');
var passwordGen = require('password-generator');
const recast = require('recastai');
const bcrypt = require('bcrypt-nodejs');
const inLoop = require('botpress-hitl');
const crypto = require('cryptojs').Crypto;
console.log(passwordGen(30, false));

module.exports = function(bp) {
  // Listens for a first message (this is a Regex)
  // GET_STARTED is the first message you get on Facebook Messenger
  bp.hear(/GET_STARTED|hello|hi|test|hey|holla/i, (event, next) => {
    event.reply('#welcome'); // See the file `content.yml` to see the block
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
   *     DONE===>  ASK USER FOR PASSWORD PROPERTIES (REMEMBRABLE, LENGTH, ETC);
   *       SAVE TO LOG FILE, FOR USER TO BE ABLE TO RETRIEVE
   */

   bp.hear('QUICKREPLY.B1', (event, next) => {
     const generatePassword = passwordGen(7, true);
     bp.messenger.sendText(generatePassword);
     try {
      const encrypted = crypto.AES.encrypt(generatePassword, "anna");
      const decrypted = crypto.AES.decrypt(encrypted,"anna");   
      console.log("ENCRYPTED STUFF: ", encrypted);
      console.log("DECRYPTED STUFF: ", decrypted);
  bp.messenger.sendText(event.user.id, `Here is a simple password I generated for you:`);
  bp.messenger.sendText(event.user.id, generatePassword)
  event.reply('#quickReply');
  } catch (e) {
      console.log("THE ENCRYPTION KEY IS WRONG!!");
      bp.messenger.sendText(event.user.id, generatePassword);
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
  bp.messenger.sendText(event.user.id, `Your custom password is:`);
  bp.messenger.sendText(event.user.id, `${customPassword()}`);
  event.reply('#quickReply');
});




/**
 * we nid a custom password
 */
bp.hear('QUICKREPLY.B4', (event, next) =>{
  if (bp.convo.find(event)) {
    return event.reply('#askStopConvo')
  }
  bp.convo.start(event, convo => {
    convo.threads['default'].addQuestion('#askPasswordLength', [
      {
        pattern: /(\d+)/,
        callback:response => {
          // convo.say('#sendResult', {
          //   response: response.match
          // });
          convo.set('minLength', response.match)
          console.log(`THE RESPONSE IS: ${response.match}`)
          
         convo.switchTo('lowercaseMinCount');
         //convo.switchTo('uppercaseMinCount');
        // convo.switchTo('specialCharacterMin');
         
        
         //convo.say(`Your lowercassMin is: ${lowercaseMinNumber}`)
        }
      }, {
        default: true,
        callback: response => {
          convo.say('#wrongNumberInput');
          convo.repeat()
        }
      }
    ]);

    convo.createThread('lowercaseMinCount')
    convo.threads['lowercaseMinCount'].addQuestion('#lowerCaseMinPass', [
      {
        pattern: /(\d+)/,
        callback: (response =>{
          convo.set('lowercaseMin', response.match);
          convo.switchTo('uppercaseMinCount');
        })
      }, {
        default: true,
        callback: response => {
          convo.say('#wrongNumberInput');
          convo.repeat()
        }
      }
    ])

    convo.createThread('uppercaseMinCount')
    convo.threads['uppercaseMinCount'].addQuestion('#upperCaseMinPass', [
      {
        pattern: /(\d+)/,
        callback: (response =>{
          convo.set('uppercaseMin', response.match);
          convo.switchTo('specialCharacterMin');
        })
      }, {
        default: true,
        callback: response => {
          convo.say('#wrongNumberInput');
          convo.repeat()
        }
      }
    ])


    convo.createThread('specialCharacterMin')
    convo.threads['specialCharacterMin'].addQuestion('#specialCharMinPass', [
      {
        pattern: /(\d+)/,
        callback: (response =>{
          convo.set('special', response.match);
          convo.switchTo('numbersMin');
        })
      }, {
        default: true,
        callback: response => {
          convo.say('#wrongNumberInput');
          convo.repeat()
        }
      }
    ])

    convo.createThread('numbersMin')
    convo.threads['numbersMin'].addQuestion('#numberPass', [
      {
        pattern: /(\d+)/,
        callback: (response =>{
          convo.set('numbersMinCount', response.match);
          convo.switchTo('MaxLength');
        })
      }, {
        default: true,
        callback: response => {
          convo.say('#wrongNumberInput');
          convo.repeat()
        }
      }
    ]);

    convo.createThread('MaxLength')
    convo.threads['MaxLength'].addQuestion('#askPasswordMax', [
      {
        pattern: /(\d+)/,
        callback: (response =>{
          convo.set('maxLength', response.match);
          convo.next()
        })
      }, {
        default: true,
        callback: response => {
          convo.say('#wrongNumberInput');
          convo.repeat()
        }
      }
    ])



    convo.on('done', ()=>{
      const txt = txt => bp.messenger.createText(event.user.id, txt)      
      var lowerMin = convo.get('lowercaseMin');
      var upperMin = convo.get('uppercaseMin');
      var specialCharMin = convo.get('special');
      var miniLength = convo.get('minLength')
      var numMin = convo.get('numbersMinCount');
      var maxiLength = convo.get('maxLength')
      // convo.say('#sendResult', {
      //   response: lowerMin.toString(),
      //   responseTwo: upperMin,
      //   responseThree: specialCharMin
      // })
      var maxLength = parseInt(maxiLength,10);
      var minLength = parseInt(miniLength,10);
      var uppercaseMinCount = parseInt(upperMin,10);
      var lowercaseMinCount = parseInt(lowerMin,10);
      var numberMinCount = parseInt(numMin,10);;
      var specialMinCount = parseInt(specialCharMin,10);
      var UPPERCASE_RE = /([A-Z])/g;
      var LOWERCASE_RE = /([a-z])/g;
      var NUMBER_RE = /([\d])/g;
      var SPECIAL_CHAR_RE = /([\?\-])/g;
      var NON_REPEATING_CHAR_RE = /([\w\d\?\-])\1{2,}/g;
      if (minLength > maxLength) {
        bp.messenger.sendText(event.user.id, "Urh Oh!! The maximum length of password is lesser than the minimum length of password. Please try again");
        convo.switchTo('default');
        event.reply('#quickReply')
           console.log("HOUSTON!!!!")
      }else  {
         function customPassword() {
          var password = "";
          var randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
          while (!isStrongEnough(password)) {
            password = passwordGen(randomLength, false, /[\w\d\?\-]/);
          }
          return password;
         }
         var genPass = customPassword()
            console.log(`GEN PASS IS: ${genPass}`)
            convo.say('#generatedPassText');
            convo.say(txt(genPass))
            convo.say('#quickReply');
         //console.log(customPassword());
      } function isStrongEnough(password) {
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
    })
  })
  

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

const passwordGen = require('password-generator');
module.exports = function customPassword(bp){
    bp.hear(/QUICKREPLY.B4|QUICKREPLYFAST.B4/, (event, next) =>{
        if (bp.convo.find(event)) {
          return event.reply('#askStopConvo')
        }
        bp.convo.start(event, convo => {
          convo.threads['default'].addQuestion('#askPasswordLength', [
            {
              pattern: /(\d+)/,
              callback:response => {
                
                convo.set('minLength', response.match)
                console.log(`THE RESPONSE IS: ${response.match}`)
                
               convo.switchTo('lowercaseMinCount');
               
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
            try {
              var lowerMin = convo.get('lowercaseMin');
              var upperMin = convo.get('uppercaseMin');
              var specialCharMin = convo.get('special');
              var miniLength = convo.get('minLength')
              var numMin = convo.get('numbersMinCount');
              var maxiLength = convo.get('maxLength')
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
              var total = uppercaseMinCount+lowercaseMinCount+numberMinCount+specialMinCount
                try {
                  if (minLength > maxLength) {
                    bp.messenger.sendText(event.user.id, "Urh Oh🚨🚨!! The maximum length of password is lesser than the minimum length of password. Please try again 👇🏾👇");
                    convo.switchTo('default');
                    event.reply('#quickReply')
                       console.log("HOUSTON!!!!")
                  }
                  if (total > maxLength) {
                    bp.messenger.sendText(event.user.id, "It seems something is wrong. The maximum password length is too small to contain the specified password specifications.")
                  } else{
                    function customPassword() {
                      var password = "";
                      var randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
                      while (!isStrongEnough(password)) {
                        password = passwordGen(randomLength, false, /[\w\d\?\-]/);
                      }
                      return password;
                     }
                    
                      let genPass = customPassword()
                      console.log(`GEN PASS IS: ${genPass}`)
                      convo.say('#generatedPassText');
                      convo.say(txt(genPass))
                      convo.say('#passwordActionText')
                      convo.say('#quickReply');
                     
                      
                    
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
                  }
                   
                } catch (e) {
                  bp.messenger.sendText(event.user.id, "It seems something is wrong. The maximum password length is too small to contain the specified password specifications.")
                }
                   
                 //console.log(customPassword());
               
            } catch (e) {
              bp.messenger.sendText(event.user.id, "It seems something is wrong. The maximum password length is too small to contain the specified password specifications.")
            }      
            
          })
        })
      })
}

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
      });
}
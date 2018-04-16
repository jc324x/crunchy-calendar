// default config file location is: google-apps-script-config/crunchy-calendar

// 

// -- Check String for Substring

/**
 * Returns true if the string contains the substring.
 *
 * @param {string} val
 * @param {string} str
 * @returns {boolean}
 */

function checkStringForSubstring(val, str) {
  if (str.indexOf(val) > -1 ) {
    return true;
  } else {
    return false;
  }
} 

/**
 * validateValueString
 *
 * @param str
 * @returns {undefined}
 */

function validateValueString(str) {
  return str.trim();
  
// const trimmedString = myString.trim();
  // if ((str.charAt(0)) === " ") {
  //   str = str.substr(1);
  // }

  // if ((str.charAt(str.length - 1) === " ")) {
  //   str = str.slice(0, -1);
  // }
  // return str;
}

function validatePropertyString(str) {
  str = String(str.toLowerCase());
  str = str.replace(/ /g, '_');
  str = str.replace(/[^A-Za-z0-9]/g, '_'); // no symbols
  return str;
} 

// end

function testingMessageBody() {
  var threads = GmailApp.search('is:unread from:"jchristensen@blakeschool.org"');
  for (var i = 0; i < threads.length; i++) {
    var thread   = threads[i];
    var messages = thread.getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message = messages[i];
      var body    = message.getPlainBody();
      var object  = objectFromEmailBody(body);
      Logger.log(JSON.stringify(object));
    } 
  } 
} 

function objectFromEmailBody(body) {
  var result = {};
  var lines = body.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (checkStringForSubstring(":", line)) {
      var prop  = line.substring(0, line.indexOf(":"));
      var value = line.substring(line.indexOf(":")+1);
      prop = validatePropertyString(prop);
      value = validateValueString(value);
      result[prop] = value;
    }
  } 
  return result;
}

function testing() {
  testingMessageBody();
}

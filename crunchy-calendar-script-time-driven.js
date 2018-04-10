// default config file location is: google-apps-script-config/crunchy-calendar

function crunchy_calendar_script_time_driven() {
  var threads = GmailApp.search('is:unread from:"jchristensen@blakeschool.org"');
  for (var i = 0; i < threads.length; i++) {
    var thread   = threads[i];
    var messages = thread.getMessages();

    for (var j = 0; j < messages.length; j++) {
      var message = messages[i];
      Logger.log(message.getSubject());
      Logger.log(message.getPlainBody());
    } 
  } 
} 


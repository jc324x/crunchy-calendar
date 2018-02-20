// main -> function onResponseCreateEventWithAttachment()

function dateObjectFromDateAndTime(date, time) {
  return new Date (date + "," + time);
} 

// fix in main.js  -> 
// handle the naming schema before passing it to the function, that's just dumb

function createMergedDocument(naming, template, fldr, obj, opt) {
  var name = findReplaceInString(naming, obj);
  var file = copyFileToFolder(template, fldr).setName(name);
  var doc  = openFileAsType(file, "document");
  findReplaceInDoc(doc, obj);
  return file;
} 

// port over to form.js

function lastFormResponseAsObject(form) {
  var result        = {};
  var formResponses = form.getResponses();
  var lastResponse  = formResponses[formResponses.length - 1];
  var itemResponses = lastResponse.getItemResponses();
 
  for (var i = 0; i < itemResponses.length; i++) {
    var itemTitle     = itemResponses[i].getItem().getTitle().toLowerCase();
    var itemResponse  = itemResponses[i].getResponse();
    result[itemTitle] = itemResponse;
  } 

  result["email address"] = lastResponse.getRespondentEmail();
  result.timestamp        = lastResponse.getTimestamp();
  return result;
} 

// Staging

function getCalendarByName(name) {
  return CalendarApp.getCalendarsByName(name)[0];
} 

function singleDayCalendarEventWithAttachment(rsp, cal, file) {
  var id = cal.getId();
  start  = dateObjectFromDateAndTime(rsp.Date, rsp.Start);
  end    = dateObjectFromDateAndTime(rsp.Date, rsp.End);

 var eventObj = {
    summary: 'Space X Launch',
    location: 'SPACE',
    description: 'They put a car in space?!',
    start: {dateTime: start.toISOString()},
    end: {dateTime: end.toISOString()},
    attachments: [{
        'fileUrl': "https://docs.google.com/document/d/1Kl3uXKHNLW5SuFhN3v2TpnE7rDbkWhx96mlynVPV42A/edit",
        'title': 'Attached Document'}, 
      {'fileUrl': "https://drive.google.com/open?id=15boI1XDEkBfwf2BHQOMrbWH66PxfC0ey",
        'title': 'Star Man'}
    ]
  };

  var create = Calendar.Events.insert(eventObj, id, {"supportsAttachments" : true});
}

function onResponseCreateEventWithAttachment() {

  // in production, this will actually come from the form
  // ...but for now, let's just test 

  var obj = {
    Date:  "2/6/2018",
    Start: "8:30:00 AM",
    End:   "05:00:00 PM",
    Description: "Neat!"
  };

  var form = FormApp.getActiveForm();
  Logger.log(lastFormResponseAsObject(form));
  var cal  = getCalendarByName("Development");
  var file = DriveApp.getFileById("1Kl3uXKHNLW5SuFhN3v2TpnE7rDbkWhx96mlynVPV42A");
  singleDayCalendarEventWithAttachment(obj, cal, file);
} 

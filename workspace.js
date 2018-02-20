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

// function singleDayCalendarEventWithAttachment(rsp, cal, file) {
//   var id = cal.getId();
//   start  = dateObjectFromDateAndTime(rsp.Date, rsp.Start);
//   end    = dateObjectFromDateAndTime(rsp.Date, rsp.End);

//  var eventObj = {
//     summary: 'Space X Launch',
//     location: 'SPACE',
//     description: 'They put a car in space?!',
//     start: {dateTime: start.toISOString()},
//     end: {dateTime: end.toISOString()},
//     attachments: [{
//         'fileUrl': "https://docs.google.com/document/d/1Kl3uXKHNLW5SuFhN3v2TpnE7rDbkWhx96mlynVPV42A/edit",
//         'title': 'Attached Document'}, 
//       {'fileUrl': "https://drive.google.com/open?id=15boI1XDEkBfwf2BHQOMrbWH66PxfC0ey",
//         'title': 'Star Man'}
//     ]
//   };

//   var create = Calendar.Events.insert(eventObj, id, {"supportsAttachments" : true});
// }

function dateObjectFromDateAndTime(date, time) {
  return new Date (date + "," + time);
} 

// calendar = form
// summary  = title
// location = location

function dateFromFormResponse(time, date) {
  var hours   = time.split(":")[0];
  var minutes = time.split(":")[1];
  var result  = new Date (date);
  result.setHours(hours);
  result.setMinutes(minutes);
  return result;
}

function createSingleDayCalendarEventWithAttachment(rsp, cal, file) {
  var id    = cal.getId();
  var startISO = dateFromFormResponse(rsp.start, rsp.date).toISOString();
  var endISO   = dateFromFormResponse(rsp.end, rsp.date).toISOString();
  var event = {

    // start: {dateTime: start.toISOString()},
    // end: {dateTime: end.toISOString()},
    start: {dateTime: startISO},
    end: {dateTime: startISO},
    summary: rsp.title,
    location: rsp.location,
    description: rsp.description,
    // attachments: [{
    //   fileUrl: file.getUrl(),
    //   title: file.getTitle()
    // }]
  };

  Logger.log(event);

  Calendar.Events.insert(event, id, {"supportsAttachments" : true});
}

function testing() {
  var form = FormApp.getActiveForm();
  var cal  = getCalendarByName("Development");
  var file = DriveApp.getFileById("1Kl3uXKHNLW5SuFhN3v2TpnE7rDbkWhx96mlynVPV42A");
  var rsp  = lastFormResponseAsObject(form);
  Logger.log(rsp);
  createSingleDayCalendarEventWithAttachment(rsp, cal, file);
} 

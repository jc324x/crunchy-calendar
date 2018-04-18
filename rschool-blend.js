// default config file location is: google-apps-script-config/crunchy-calendar

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
}

function validatePropertyString(str) {
  str = String(str.toLowerCase());
  str = str.replace(/ /g, '_');
  str = str.replace(/[^A-Za-z0-9]/g, '_'); // no symbols
  return str;
} 

// -- Array of Objects For Form Items

/**
 * arrayOfObjetsForFormItems
 *
 * @param form
 * @returns {undefined}
 */

function arrayOfObjectsForFormItems(form) {
  var result = [];
  var items  = form.getItems();
  for (var i = 0; i < items.length; i++) {
    var obj   = {};
    obj.index = i;
    obj.title = items[i].getTitle();
    obj.id    = items[i].getId();
    obj.type  = items[i].getType();
    obj.item  = items[i];
    result.push(obj);
  }
  return result;
}

function findObjectInArrayOfObjects(arrObj, prop, val) {
  for (var i = 0; i < arrObj.length; i++) {
    var obj = arrObj[i];
    for (var p in obj) {
      if (obj.hasOwnProperty(prop) && p == prop && obj[p] == val) {
          return obj;
      }
    }
  }
}

// end

// validation? or garbage in garbage out?
function objectFromEmailBody(body) {
  var result = {};
  var lines  = body.split("\n");
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (checkStringForSubstring(":", line)) {
      var prop  = line.substring(0, line.indexOf(":"));
      var value = line.substring(line.indexOf(":")+1);
      prop      = validatePropertyString(prop);
      value     = validateValueString(value);
      result[prop] = value;
    }
  } 
  return result;
}

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

function formItemByTitleType(arrObj, title, type) {
  var obj = findObjectInArrayOfObjects(arrObj, "title", title); 
  switch(type) {
      case "CheckboxGridItem": return obj.item.asCheckboxGridItem();
      case "CheckboxItem": return obj.item.asCheckboxItem();
      case "DateItem": return obj.item.asDateItem();
      case "DateTimeItem": return obj.item.asDateTimeItem();
      case "DurationItem": return obj.item.asDurationItem();
      case "GridItem": return obj.item.asGridItem();
      case "ImageItem": return obj.item.asImageItem();
      case "ListItem": return obj.item.asListItem();
      case "MultipleChoiceItem": return obj.item.asMultipleChoiceItem();
      case "PageBreakItem": return obj.item.asPageBreakItem();
      case "ParagraphTextItem": return obj.item.asParagraphTextItem();
      case "ScaleItem": return obj.item.asScaleItem();
      case "SectionHeaderItem": return obj.item.asSectionHeaderItem();
      case "TimeItem": return obj.item.asTimeItem();
      case "TextItem": return obj.item.asTextItem();
      case "VideoItem": return obj.item.asVideoItem();
      default: return false;
  }
}

/* next...
 * start_time 4:30 PM -> into start_time_hours -> 16, start_time_minutes -> 30
 * date -> new Date (date?)
*/ 

// appendFormResponse(arrObj, title, type, val, val2, formResponse)
// appendFormResponse(items, "Event Title", "TextItem", object.event_title, null, formResponse);
// appendFormResponse(items, "Start Time", "TimeItem", object.event_start_minutes, object.event_start_hours, null, formResponse);

function appendFormResponse(arrObj, title, type, object, prop, formResponse) {
  var item     = formItemByTitleType(arrObj, title, type);
  var response = item.createResponse(object[prop]);
  return formResponse.withItemResponse(response);
}

function appendFormResponseSetTime(arrObj, title, type, start, end, formResponse) {
  var item     = formItemByTitleType(arrObj, title, type);
  var response = item.createResponse(start, end);
  return formResponse.withItemResponse(response);
}

function testingPreFilledForm() {
  var threads = GmailApp.search('is:unread from:"jchristensen@blakeschool.org"');
  for (var i = 0; i < threads.length; i++) {
    var thread   = threads[i];
    var messages = thread.getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message       = messages[i];
      var body          = message.getPlainBody();
      var object        = objectFromEmailBody(body);
      object.date       = new Date();
      var form          = FormApp.getActiveForm();
      var response      = form.createResponse();
      var items         = arrayOfObjectsForFormItems(form);
      response          = appendFormResponse(items, "Event Title", "TextItem", object, "event_title", response);
      response          = appendFormResponse(items, "Date", "DateItem", object, "date", response);
      response          = appendFormResponseSetTime(items, "Start Time", "TimeItem", 0, 30, response);
      response          = appendFormResponseSetTime(items, "End Time", "TimeItem", 4, 30, response);
      var url          = response.toPrefilledUrl();
      Logger.log(url);  
    } 
  } 
}

// -- NO EPF --
 
// createEventInGoogleCalendar()
// sendConfirmationEmail()

// -- EPF NEEDED --
// createEventInGoogleCalendar()
// sendEPFRequest()
// ...()

// Brainstorm
// the form needs to match up the email object with the form response to check for incongruities? 
// wait. is there a way to create an inaccessible page and then attach responses to it? hmm...
// could have Id of Gmail message, and the full calendar event title "Parent Meeting (MS, Bovey)"
// 
 
// object.start_time -> object.start_time_minutes, object.start_time_hours | from what's given in rSchool
// where should JSON files be stored and how? what is their purpose?
// get events matching "- Pending EPF", build array, send prompt emails | *need* to attach events or just find in folder?
// changes to event -> get event Id, match to JSON object

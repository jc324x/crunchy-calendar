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
      case "TextItem": return obj.item.asTextItem();
      case "VideoItem": return obj.item.asVideoItem();
      default: return false;
  }
}

function testingPreFilledForm() {
  var threads = GmailApp.search('is:unread from:"jchristensen@blakeschool.org"');
  for (var i = 0; i < threads.length; i++) {
    var thread   = threads[i];
    var messages = thread.getMessages();
    for (var j = 0; j < messages.length; j++) {
      var message               = messages[i];
      var body                  = message.getPlainBody();
      var object                = objectFromEmailBody(body);
      var form                  = FormApp.getActiveForm();
      var formResponse          = form.createResponse();
      var items                 = arrayOfObjectsForFormItems(form);

      var eventTitleItem        = formItemByTitleType(items, "Event Title", "TextItem");
      var eventTitleResponse    = eventTitleItem.createResponse(object.event_title);
      formResponse.withItemResponse(eventTitleResponse);
      Logger.log("TEST A");
      // var dateItem              = formItemByTitleType(items, "Date", "DateItem");
      // var dateItemResponse      = dateItem.createResponse(object.date);
      // formResponse.withItemResponse(dateItemResponse);
      // Logger.log("TEST B");
      // var startTimeItem         = formItemByTitleType(items, "Start Time", "TimeItem");
      // var startTimeItemResponse = startTimeItem.createResponse(object.start_time);
      // formResponse.withItemResponse(startTimeItemResponse);
      // Logger.log("TEST C");
      // var endTimeItem    = formItemByTitleType(items, "End Time", "TimeItem");
       var url = formResponse.toPrefilledUrl();
      Logger.log(url);  // You could do something more useful here.
    } 
  } 
}


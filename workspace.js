// v0.1.2-beta - Review

// dates aren't lining up, other than that it's good

/**
 * Returns a string. 
 * Words %wrapped% in '%' are replaced with the matching property value.
 * Trailing punctuation marks are allowed. 
 *
 * @param {Object} obj
 * @param {string} str
 * @param {string} delim
 * @returns {string}
 */

function findReplaceInSubstring(substr, obj) {
  if (typeof substr !== 'string') {
    return substr;
  }

  var count = substr.split("%").length - 1;

  if (count !== 2) {
    return substr;
  }

  substr      = substr.replace(/%/g, "");
  var last = substr.slice(-1);

  if (last.match(/[a-z]/i)) { 
    return obj[substr];
  } else {
    substr = substr.substring(0, substr.length - 1);
    return obj[substr] + last;
  }
}

function findReplaceInString(str, obj) {
  var result = [];
  var split  = str.split(" ");

  for (var i = 0; i < split.length; i++) {
    result.push(findReplaceInSubstring(split[i], obj));
  }

  return result.join(" ");
} 

// main -> function onResponseCreateEventWithAttachment()

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

// calendar = form
// summary  = title
// location = location

function isoStringFromFormResponse(time, date) {
  var hours   = time.split(":")[0];
  var minutes = time.split(":")[1];
  var result  = new Date (date);
  result.setHours(hours);
  result.setMinutes(minutes);
  return result.toISOString();
}

function CalendarEvent(summary, location, description, start, end, attachments, attendees) {
  this.summary     = summary;
  this.location    = location;
  this.description = description;
  this.start       = start;
  this.end         = end;
  this.attendees   = attendees;
  this.attachments = attachments;
}

function CalendarDate(time, date, timezone) {
  Logger.log("date - " + date);
  Logger.log("time - " + time);
  var hours   = time.split(":")[0];
  var minutes = time.split(":")[1];
  var dateObj = new Date (date);
  dateObj.setHours(hours);
  dateObj.setMinutes(minutes);
  Logger.log("locale time string - " + dateObj.toLocaleTimeString());
  var dateTime = dateObj.toISOString();
  Logger.log(dateTime);
  this.dateTime = dateTime;
  this.timeZone = timezone;
}

// 'start': {
//     'dateTime': '2015-05-28T09:00:00-07:00',
//     'timeZone': 'America/Los_Angeles'
//   },

function findFileAtPath(path, mime) {
  if (mime !== undefined) {
    return findFileAtPathType(path, mime);
  } else {
    return findFileAtPathAny(path);
  }
} 

function matchMIMEType(file, mime) {
  var type;

  if (file) {
    type = file.getMimeType(); 
  } else {
    return false;
  }

  if (type === mime) {
    return true;
  } else {
    return false;
  }
} 


function CalendarAttendee(email) {
  this.email = email;
}

function CalendarAttachment(file) {
  this.fileUrl = file.getUrl();
  this.title = file.getName();
}

function createSingleDayCalendarEventWithAttachment(event, cal) {
  var id = cal.getId();
  Calendar.Events.insert(event, id, {"supportsAttachments" : true});
} 

function copyFileToFolder(file, fldr) {
  var name = file.getName();
  var dest = findFileInFolderAny(name, fldr);
  if (dest === false) {
    file.makeCopy(name, fldr);
  }
  return findFileInFolderAny(name, fldr);
} 

function openFileAsType(file, mime) {
  var id = file.getId();
  switch (mime) {
    case "document": return DocumentApp.openById(id);
    case "form": return FormApp.create(name);
    case "presentation": return PresentationApp.create(name);
    case "spreadsheet": return SpreadsheetApp.openById(id);
    default: return false;
  }
} 

// mergeObjectWithDocument

function documentMergeObject(naming, template, fldr, obj) {
  var name = findReplaceInString(naming, obj);
  var file = copyFileToFolder(template, fldr).setName(name);
  var doc  = openFileAsType(file, "document");
  findReplaceInDoc(doc, obj);
  return file;
} 

function findReplaceInDoc(doc, obj) {
  var body = doc.getBody(); 
  for (var prop in obj) {
    body.replaceText(("%" + prop + "%"), obj[prop]);
  } 
} 

function arrayOfObjectsFromArguments() {
  var result = [];
  for (var i = 0; i < arguments.length; i++) {
    result.push(arguments[i]);
  } 
  return result;
}

// naming convention or name? which to pass?

function verifyFileAtPath(path, mime) {
  var folderPath = targetPath(path, 1);
  verifyFolderPath(folderPath);

  if (checkForFileAtPath(path, mime)) {
    return findFileAtPath(path, mime);
  } else {
    return createFileAtPath(path, mime);
  }
}

function targetPath(path, opt) {
  path      = verifyPath(path);
  var split = path.split("/");

  if (opt === 0 || opt === undefined) {
    return split.pop();
  } else if (opt === 1) {
    split.pop();
    return split.join("/");
  } 
} 

function checkForFileAtPath(path, mime) {
  var result;

  if (mime !== undefined) {
    result = findFileAtPathType(path, mime);
  } else {
    result = findFileAtPathAny(path);
  }

  if (result) {
    return true;
  } else {
    return false;
  }
}

function createFileAtPath(path, mime) {
  var name = targetPath(path, 0);
  path     = targetPath(path, 1);
  var fldr = findFolderAtPath(path);
  return createFileInFolder(name, fldr, mime);
} 

function findFileAtPathAny(path) {
  path     = verifyPath(path);
  var file = targetPath(path, 0);
  path     = targetPath(path, 1);
  var fldr = findFolderAtPath(path);
  return findFileInFolder(file, fldr);
} 

function verifyFolderPath(path) {
  path = verifyPath(path);
  var split = path.split("/");
  var fldr;
  for (i = 0; i < split.length; i++) {
    var fi = DriveApp.getRootFolder().getFoldersByName(split[i]);
    if (i === 0) {
      if (!(fi.hasNext())) {
        DriveApp.createFolder(split[i]);
        fi = DriveApp.getFoldersByName(split[i]);
      } 
      fldr = fi.next();
    } else if (i >= 1) {
      fi = fldr.getFoldersByName(split[i]);
      if (!(fi.hasNext())) {
        fldr.createFolder(split[i]);
        fi = DriveApp.getFoldersByName(split[i]);
      } 
      fldr = fi.next();
    }
  } 
  return fldr;
}

function verifyPath(path) {
  if ((path.charAt(0)) === "/") {
    path = path.substr(1);
  }
  
  if ((path.charAt(path.length - 1) === "/")) {
    path = path.slice(0, -1);
  }

  return path;
}

function findFileAtPathType(path, mime) {
  path     = verifyPath(path);
  mime     = expandMIMEType(mime);
  var file = targetPath(path, 0);
  path     = targetPath(path, 1);
  var fldr = findFolderAtPath(path);

  if (fldr) {
    file = findFileInFolder(file, fldr);
  } else {
    return false;
  }

  if (file && matchMIMEType(file, mime)) {
    return file;
  } else {
    return false;
  }
} 

function expandMIMEType(val) {
  return "application/vnd.google-apps." + val.toLowerCase();
}

function findFolderAtPath(path) {
  path = verifyPath(path);
  var fi, fldr;
  var split = path.split("/");

  for (i = 0; i < split.length; i++) {
    if (i === 0) {
      fi = DriveApp.getRootFolder().getFoldersByName(split[i]);
      if (fi.hasNext()) {
        fldr = fi.next();
      } else {
        return false;
      }
    } else if (i >= 1) {
        fi = fldr.getFoldersByName(split[i]);
        if (fi.hasNext()) {
          fldr = fi.next();
        } else {
          return false;
        }
    }
  } 

  var target = targetPath(path);
  if (fldr.getName() === target) {
    return fldr;
  } else {
    return false;
  }
}

function findFileInFolderAny(name, fldr) {
  var files = arrayOfFilesInFolder(fldr);
  var names = arrayOfFileNames(files); 
  if (checkArrayForValue(names, name)) {
    return fldr.getFilesByName(name).next();
  } else {
    return false;
  }
} 

function findFileInFolderType(name, fldr, mime) {
  mime = expandMIMEType(mime);
  var files = arrayOfFilesInFolder(fldr);
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    if ((file.getName() === name) && file.getMimeType() === mime) {
      return file;
    }
  } 
  return false;
} 

function findFileInFolder(name, fldr, mime) {
  if (mime !== undefined) {
    return findFileInFolderType(name, fldr, mime);
  } else {
    return findFileInFolderAny(name, fldr);
  }
}

function checkArrayForValue(arr, val) { 
  return arr.indexOf(val) > -1; 
}

function createFileInFolder(name, fldr, mime) {
  var file = createFileAtRoot(name, mime);
  return moveFileToFolder(file, fldr);
}  

function moveFileToFolder(file, fldr) {
  var result;
  var name = file.getName();
  var dest = findFileInFolderAny(name, fldr);

  if (dest === false) {
    file.makeCopy(name, fldr);
    result = findFileInFolderAny(name, fldr);
  }

  if (result) {
    return result;
  } else {
    return false;
  }
} 

function createFileAtRoot(name, mime) {
  switch (mime) {
    case "document": 
      var document = DocumentApp.create(name).getId();
      return DriveApp.getFileById(document);
    case "form":
      var form = FormApp.create(name).getId();
      return DriveApp.getFileById(form);
    case "presentation": 
      var presentation = SlidesApp.create(name).getId();
      return DriveApp.getFileById(presentation);
    case "spreadsheet": 
      var spreadsheet = SpreadsheetApp.create(name).getId();
      return DriveApp.getFileById(spreadsheet);
    default: DriveApp.getRootFolder().createFile(name, "");
  }
}

function arrayOfFilesInFolder(fldr) {
  // Logger.log(fldr);
  var result = [];
  var fi     = fldr.getFiles();
  while (fi.hasNext()) {
    var file = fi.next();
    result.push(file);
  } 
  return result;
}

function arrayOfFileNames(arr) {
  var result = [];
  for (var i = 0; i < arr.length; i++) {
    var name = arr[i].getName();
    result.push(name);
  }
  return result;
}

function documentMergeObject(naming, template, fldr, obj) {
  var name = findReplaceInString(naming, obj);
  var file = copyFileToFolder(template, fldr).setName(name);
  var doc  = openFileAsType(file, "document");
  findReplaceInDoc(doc, obj);
  return file;
} 

function testing() {
  var form        = FormApp.getActiveForm();
  var cal         = getCalendarByName("Development");
  var rsp         = lastFormResponseAsObject(form);
  // Logger.log(rsp);
  var naming      = findReplaceInString("%title% - %location% %date%", rsp);
  var template    = verifyFileAtPath("crunchy-calendar/template", "document");
  var fldr        = verifyFolderPath("crunchy-calendar/exports");
  var file        = documentMergeObject(naming, template, fldr, rsp);
  var timezone    = "America/Chicago";
  var start       = new CalendarDate(rsp.start, rsp.date, timezone);
  Logger.log("start - " + start.dateTime);
  var end         = new CalendarDate(rsp.end, rsp.date, timezone);
  Logger.log("end - " + end.dateTime);
  var attachment  = new CalendarAttachment(file);
  var attachments = arrayOfObjectsFromArguments(attachment);
  var event       = new CalendarEvent(rsp.title, rsp.location, rsp.description, start, end, attachments);
  // Logger.log(event);
  createSingleDayCalendarEventWithAttachment(event, cal);
} 

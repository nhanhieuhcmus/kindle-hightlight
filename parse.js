// module.exports = parseContent;

const parseLines = require("./parselines");

function groupByTitle(data) {
  const result = {};
  data.forEach(item => {
    const {title} = item;
    if (!result[title]) {
      result[title] = item;
    }
  });
  return result;
}

function parseContent(data) {
    var records = splitIntoRecords(data);
    return makeArray(records);
}

function makeArray(arr) {
    var col = [];
  
    for (var i = 0; i < arr.length; i++) {
  
      var record = arr[i];
  
      // split record into lines (section of a record - title / time / text)
      var lines = splitRecord(record);
  
      // initialize empty record object
      var singleRecord = {};
  
      // first line - title and author
      var first = parseLines.firstLine(lines);
      if (first) {
        singleRecord.title = first.title;
        singleRecord.author = first.author;
      }
  
      //second line - type, location, time
      var second = parseLines.secondLine(lines);
      if (second) {
        singleRecord.time = second.time;
        singleRecord.type = second.type;
        singleRecord.location = second.location;
        singleRecord.page = second.page;
      }
  
      // third line - content
      var third = parseLines.thirdLine(lines);
      if (third) {
        singleRecord.text = third;
      }
  
      // push record to collection
      col.push(singleRecord);
  
    } // end of record iteration
    return col;
  }

function splitIntoRecords(data) {
    return data.split("\r\n==========");
}
function splitRecord(record) {
    var line = record.split('\r\n');
    var lines = [];
    for (var j = 0; j < line.length; j++) {
      var l = line[j];
      if (l !== '') {
        lines.push(l.trim());
      }
    }
    return lines;
  }

///////////
export  {groupByTitle, parseContent};

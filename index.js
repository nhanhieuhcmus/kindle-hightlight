function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
        var contents = e.target.result;
        var parseObj = parseContent(contents);
        // console.log(
        //     "%cnhanhh-->",
        //     "color:black;background-color:yellow",
        //     ": parseObj: ",
        //     parseObj
        // );
        const groupByTilteObj = groupByTitle(parseObj);
        // console.log(
        //     "%cnhanhh-->",
        //     "color:black;background-color:yellow",
        //     ": groupByTilteObj: ",
        //     groupByTilteObj
        // );

        displayContents(groupByTilteObj);
    };
    reader.readAsText(file);
}

function displayContents(contents) {
    console.log("%cnhanhh-->",'color:black;background-color:yellow',": contents: ", contents);
    var element = document.getElementById("file-content");
    for (const [key, value] of Object.entries(contents)) {
        // render title
        let titleEle = document.createElement("h2");
        titleEle.innerText = key;
        titleEle.style.backgroundColor = "black";
        titleEle.style.color = "white";
        titleEle.style.width = "fit-content";
        titleEle.style.padding = "8px";
        titleEle.style.borderRadius = "20px";
        titleEle.style.textTransform = "uppercase";


        element.appendChild(titleEle);

        // render meta
        value.forEach((item) => {
            // render location
            let locationEle = document.createElement("span");
            locationEle.innerText = item.location;
            locationEle.style.color = "white";
            locationEle.style.backgroundColor = "gray";
            element.appendChild(locationEle);

            // render hightlight
            let hightlightEle = document.createElement("li");
            hightlightEle.innerText = item.text;
            hightlightEle.style.backgroundColor = "yellow";
            hightlightEle.style.fontStyle = "italic";
            hightlightEle.style.width = "500px";
            hightlightEle.style.wordWrap = "break-word";
            hightlightEle.style.whiteSpace = "pre-wrap";
            hightlightEle.style.marginBottom = "16px";
            element.appendChild(hightlightEle);

            

        });
    }

}

function groupByTitle(data) {
    const result = {};
    data.forEach((item) => {
        if (!result[item.title]) {
            result[item.title] = [];
        }
        result[item.title].push(item);
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
        var first = firstLine(lines);
        if (first) {
            singleRecord.title = first.title;
            singleRecord.author = first.author;
        }

        //second line - type, location, time
        var second = secondLine(lines);
        if (second) {
            singleRecord.time = second.time;
            singleRecord.type = second.type;
            singleRecord.location = second.location;
            singleRecord.page = second.page;
        }

        // third line - content
        var third = thirdLine(lines);
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
    var line = record.split("\r\n");
    var lines = [];
    for (var j = 0; j < line.length; j++) {
        var l = line[j];
        if (l !== "") {
            lines.push(l.trim());
        }
    }
    return lines;
}

function firstLine(lines) {
    if (lines[0] !== undefined) {
        var t = lines[0].split(" (");
        var author = t[1] ? t[1].slice(0, -1) : "";
        return {
            title: t[0],
            author: author,
        };
    } else {
        return false;
    }
}

function secondLine(lines) {
    if (lines[1] !== undefined) {
        var t = lines[1].split("|");

        var singleRecord = {};
        for (var y = 0; y < t.length; y++) {
            var el = t[y];

            // @todo - describe time parsing
            if (el.match(/Added on/)) {
                var ti = el.split(",");
                var strTime = trim(ti[1]);
                strTime = strTime.replace("Greenwich Mean Time", "GMT");
                var m = new Date(strTime);
                // @TODO alternative syntax
                var timeFormatted = m.getTime();
                // timeFormatted = dateFormat(m, "dddd, mmmm dS, yyyy, h:MM:ss TT");
                //   timeFormatted = dateFormat.format(m,'ddd, DD/MM/YYYY HH:mm:ss');
                singleRecord.time = timeFormatted;
            }

            // Examples of type and location
            // * Highlight Loc. 516
            // * Highlight on Page 19
            // * Highlight on Page 3 | Loc. 140  |
            // * Note on Page 11
            // * Bookmark Loc. 241

            // type: Highlight | Bookmark | Note
            if (el.match(/Highlight/)) {
                singleRecord.type = "Highlight";
            } else if (el.match(/Bookmark/)) {
                singleRecord.type = "Bookmark";
            } else if (el.match(/Note/)) {
                singleRecord.type = "Note";
            }

            // on Page (if exists)
            if (el.match(/on Page/)) {
                var p = el.split("on Page");
                singleRecord.page = trim(p.pop());
            }

            // location
            if (el.match(/Location./i)) {
                // var l = el.split('Loc.');
                var l = el.split(/Location/i);
                singleRecord.location = trim(l.pop());
            }
        }
        return singleRecord;
    } else {
        return false;
    }
}

function thirdLine(lines) {
    if (lines[2] !== undefined) {
        return trim(lines[2]);
    } else {
        return false;
    }
}

function trim(str) {
    str = str.replace(/^\s+/, "");
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}

document
    .getElementById("file-input")
    .addEventListener("change", readSingleFile, false);

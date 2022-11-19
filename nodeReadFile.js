/**
 * https://github.com/baniol/kindle-my-clippings
 */
 var fs = require("fs");
 const parseContent = require("./parse");
 fs.readFile("My Clippings.txt", (err, data) => {
     if (err) throw err;
     const content = parseContent(data.toString());
     console.log("%cnhanhh-->",'color:black;background-color:yellow',": content: ", content);
 });
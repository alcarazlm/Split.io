//let data; 
var receiptOcrEndpoint = 'https://ocr.asprise.com/api/v1/receipt';
const path = require('path')
const imageFile = path.join(__dirname, '../src/imgs/receiptMock.jpeg')
var fs = require('fs');
var request = require('request');

let filename = "recent.jpeg"

function decodeBase64Image(dataString) {
  var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');

  return response;
}

var imageBuffer = decodeBase64Image(data);
console.log(imageBuffer);
fs.writeFile(filename, imageBuffer.data, function(err) {"invalid"});

request.post({
    url: receiptOcrEndpoint,
    formData: {
        client_id: 'TEST',        // Use 'TEST' for testing purpose
        recognizer: 'auto',       // can be 'US', 'CA', 'JP', 'SG' or 'auto'
        ref_no: 'ocr_nodejs_123', // optional caller provided ref code
        file: fs.createReadStream(filename) // the image file
    },
}, function (error, response, body) {
    if (error) {
        console.error(error);
    }
    data = body;
    console.log(body);
    let parsed = JSON.parse(data)
    console.log(parsed)
    //console.log(JSON.parse(data));// Receipt OCR result in JSON
});
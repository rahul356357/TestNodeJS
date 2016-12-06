const fs = require('fs');
const rl = require('readline').createInterface({
    input: fs.createReadStream("../crimedata.csv")
});
var head = {
    "ID": 0,
    "Case Number": 1,
    "Date": 2,
    "Block": 3,
    "IUCR": 4,
    "Primarytype": 5,
    "Description": 6,
    "Location Description": 7,
    "Arrest": 8,
    "Domestic": 9,
    "Beat": 10,
    "District": 11,
    "Ward": 12,
    "Community Area": 13,
    "FBI Code": 14,
    "X Coordinate": 15,
    "Y Coordinate": 16,
    "Year": 17,
    "Updated On": 18,
    "Latitude": 19,
    "Longitude": 20,
    "Location": 21
};
var firstrow=true;
var arrestedT = new Array(16).fill(0);
var arrestedF = new Array(16).fill(0);
rl.on('line', function(line) {
    var arr = line.split(new RegExp(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/));
    if(firstrow)
    {
      firstrow=false;
    }
    else {
      if (arr[head.Primarytype] == "ASSAULT") {
          if (arr[head.Arrest] == "true") {
              var  i = arr[head.Year] % 2000;
              ++arrestedT[i-1];
          }
          if (arr[head.Arrest] == "false") {
              var i = arr[head.Year] % 2000;
              ++arrestedF[i-1];
          }
      }
    }

});

var result = [];
function change() {
  var obj = {};
  var year = 2001;
  for (var i = 0; i < 16; i++) {
      obj = {
          Year: year,
          Arrested: arrestedT[i],
          NotArrested: arrestedF[i]
      }
      result.push(obj);
      year++;
  }
  return result;
}

rl.on("close", function() {
  var data=JSON.stringify(change());
  fs.writeFile("ASSAULT.json",data, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
});

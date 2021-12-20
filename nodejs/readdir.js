const testFolder = './data';
const fs = require('fs');

fs.readdir(testFolder, function(error, filelist){
    console.log(filelist); //파일리스트는 배열
});

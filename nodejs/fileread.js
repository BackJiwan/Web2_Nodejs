var fs = require('fs') //파일 시스템 모듈을 가져와서 사용한다. 접근은 fs변수를 통해서
fs.readFile('sample.txt','utf-8',function(err,data){
  console.log(data);
});

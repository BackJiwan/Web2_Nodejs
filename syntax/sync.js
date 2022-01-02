var fs = require('fs');



// console.log('A');
// var result = fs.readFileSync('syntax/sample.txt','utf8');
// console.log(result);
// console.log('C');



console.log('A');
fs.readFile('syntax/sample.txt','utf8',function(err,result){
  console.log(result);
});
console.log('C');

//여기위에까지는 생활코딩 영상을 따라한것
//이 아래부터는 노드 공홈의 문서를 보고 무지성으로 만든것
//https://istoryful.tistory.com/418 임포트가 안된다. ...
// import { readFile } from 'fs';
//
// readFile('syntax/sample.txt','utf8',(err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

var http = require('http');
var fs = require('fs');
var url = require('url'); //오른쪽의 따옴표안에 url이 자스가 제공하는 url모듈


var app = http.createServer(function(request,response){
    var _url = request.url; //아마 쿼리 데이터를 가져오는?
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url,true).pathname;


    if(pathname === '/' ){ //패스네임을 통해서 알맞은 경로로 왔는지 확인
      if(queryData.id === undefined){ //홈이라면

        fs.readdir('./data',function(error,filelist){
          var title = 'Welcome';
          var descripion = 'Hello,Node.js';
          var list = '<ul>';
          var i=0;
          while(i<filelist.length){
            list = list + `<li><a
            href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
            i = i+1;
          }
          list = list+'</ul>';

          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            <p>${descripion}</p>
          </body>
          </html>
          `;
              response.writeHead(200);
              response.end(template);
        })


      } else { //알맞게 왔지만 홈이 아닌 경우(해당하는 파일이 있을 확률이 높으며 쿼리데이터를 읽는 동적웹)
        fs.readFile(`data/${queryData.id}`,'utf-8',function(err,descripion){ //파일리드 메서드
          var title = queryData.id;
          var template = `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            <ol>
              <li><a href="/?id=HTML">HTML</a></li>
              <li><a href="/?id=CSS">CSS</a></li>
              <li><a href="/?id=JavaScript">JavaScript</a></li>
            </ol>
            <h2>${title}</h2>
            <p>${descripion}</p>
          </body>
          </html>
          `;
              response.writeHead(200);
              response.end(template);
        });
      }
    }  else {
          response.writeHead(404);
          response.end('Not found');
       }
});
app.listen(3000);

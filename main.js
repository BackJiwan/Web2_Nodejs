///Users/jw/Desktop/web/web2_nodejs
var http = require('http');
var fs = require('fs');
var url = require('url'); //오른쪽의 따옴표안에 url이 자스가 제공하는 url모듈
var qs = require('querystring'); //쿼리 스트링 모듈을 가져와서 qs로 사용한다.
var template = require('./lib/template.js');
var path = require('path');



var app = http.createServer(function(request,response){
    var _url = request.url; //아마 쿼리 데이터를 가져오는?
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url,true).pathname;

    if(pathname === '/' ){ //패스네임을 통해서 알맞은 경로로 왔는지 확인
      if(queryData.id === undefined){ //홈이라면

        fs.readdir('./data',function(error,filelist){ //데이터 폴더를 읽고 목차생성
          var title = 'Welcome';
          var description = 'Hello,Node.js';
          var list = template.list(filelist);
          var html = template.HTML(title,list,`<h2>${title}</h2>
          ${description}`,`<a href="/create">create</a>`);
          response.writeHead(200);
          response.end(html);
        });
      } else { //알맞게 왔지만 홈이 아닌 경우(해당하는 파일이 있을 확률이 높으며 쿼리데이터를 읽는 동작을 실행)
        fs.readdir('./data',function(error,filelist){ //데이터 폴더를 읽고 목차생성
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`,'utf-8',function(err,description){ //파일
            var list = template.list(filelist);
            var title = queryData.id;
            var html = template.HTML(title,list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a>
               <a href="/update?id=${title}">update</a>
               <form action="/delete_process" method="post">
                <input type="hidden" name="id" value="${title}">
                <input type="submit" value="delete">
               </form>`);
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    }  else if(pathname === '/create') { //create버튼이 눌렸을때 이동할 페이지에서의 동작
        fs.readdir('./data',function(error,filelist){ //데이터 폴더를 읽고 목차생성
          var title = 'Web - create';
          var list = template.list(filelist);
          var html = template.HTML(title,list,
            `<form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            <form>`,'');
          response.writeHead(200);
          response.end(html);
        });
    } else if(pathname === '/create_process'){//제출버튼을 눌러서 이동한 페이지에서의 동작
      var body = '';
      request.on('data',function(data){
        body += data;
      });
      request.on('end',function(){
        var post = qs.parse(body);
        var title = post.title;
        var description = post.description;
        fs.writeFile(`data/${title}`,description,'utf-8',function(err){
          response.writeHead(302, {'Location': `/?id=${title}`});
          response.end('Success');
        });
      });
    } else if(pathname === '/update'){
      fs.readdir('./data',function(error,filelist){ //데이터 폴더를 읽고 목차생성
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`,'utf-8',function(err,description){ //파일
          var list = template.list(filelist);
          var title = queryData.id;
          var html = template.HTML(title,list,
            `<form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            <form>`,'');
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname ==='/update_process'){
      var body = '';
      request.on('data',function(data){
        body += data;
      });
      request.on('end',function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`,`data/${title}`,function(error){
          fs.writeFile(`data/${title}`,description,'utf-8',function(err){
            response.writeHead(302, {'Location': `/?id=${title}`});
            response.end('Success');
          });
        });
      });
    } else if(pathname ==='/delete_process'){
      var body = '';
      request.on('data',function(data){
        body += data;
      });
      request.on('end',function(){
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        fs.unlink(`data/${filteredId}`,function(error){
          response.writeHead(302, {'Location': `/`});//사용자를 홈으로 리다이렉
          response.end('Success');
        })
      });
    }
      else {
          response.writeHead(404);
          response.end('Not found');
       }
});
app.listen(3000);

const http = require("http");
function isStaticFiles(filename){
    const path = require("path");

    var extensions = [".html",".css",".js",".png",".jpg"];
    var ext = path.extname(filename);
   return  extensions.indexOf(ext)>=0;
}
var counter = 0;
function handleRequestResponse(request, response){
    var method = request.method;
    var url = request.url;
     response.writeHead(200,"{'content-type':'text/html'}");
    console.log("Req ",request.method," URI ",request.url);
    if(url=='/'){
        counter++;
        response.write("<a href='index.html'>Login</a> U Visited this website "+counter);
        
        response.end();

    }
    else
    if(isStaticFiles(url)){
        const path = require("path");
        const fullPath = path.join(__dirname,"public"+url);
        console.log(__dirname+" NOW Start Reading Full Path is "+fullPath);
        const fs = require("fs");
        const stream = fs.createReadStream(fullPath);
        console.log("Going to Pipe as a Response"+fullPath);
        stream.pipe(response);
    }
    else
    if(method=='GET' && url.startsWith("/login")){
        const urlObj = require("url");
        var qs = urlObj.parse(url,true);
        var userid = qs.query.userid;
        var pwd = qs.query.pwd;
        if(userid == pwd){
        response.write('Welcome  '+userid);
        response.end();
        }
        else{
            response.write('Invalid Userid or Password  ');
        response.end();
        }
    }
    else
    if(method=='POST' && url=="/login"){
        var postData = '';
        const qs = require("querystring");
        request.on('data',(chunk)=>{
            postData +=chunk;
        })
        request.on('end',()=>{
            console.log("Post Data is ",postData);
            var userObject = qs.parse(postData);
            var userid = userObject.userid;
            var pwd = userObject.pwd;
            if(userid == pwd){
                response.write('Welcome  '+userid);
                response.end();
                }
                else{
                    response.write('Invalid Userid or Password  ');
                response.end();
                }
        })
       
    }
   
    else{
    response.write("<h1><a href='index.html'>Login</a> &nbsp;Hello Client I am Server...</h1>");
    response.end();
    }

}
console.log("Process is ",process.env);
var server = http.createServer(handleRequestResponse);
server.listen(process.env.PORT || 1234,()=>{
    console.log("Server Start");
})
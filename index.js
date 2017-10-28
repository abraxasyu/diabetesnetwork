var express = require('express');
var app = express();

app.use('/static', express.static('assets'));


app.get('/', function(req, res){
  res.sendFile(__dirname+'/index.html');
});
app.listen(33333, function () {
  console.log('Example app listening on port 33333!');
});

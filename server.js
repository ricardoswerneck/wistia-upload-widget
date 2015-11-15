process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config'),
      express = require('./express'),
      multer  = require('multer');

var done=false;

var app = express();

app.use(multer({ dest: './uploads/',
     rename: function (fieldname, filename) {
        return filename+Date.now();
      },
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file) {
      console.log(file.fieldname + ' uploaded to  ' + file.path)
      done=true;
    }
}));

app.post('/api/upload',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end('{ success: true}');
  }
});

app.listen(config.port);

module.exports = app;
console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);
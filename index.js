require('dotenv').config()
const express = require('express');
const formidable = require('formidable');
const fs = require("fs");
const textExtractionController = require('./controllers/text-extraction');

// Init app
const app = express();

// EJS
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

app.get('/', (req, res) => {
 
  res.render('index')
});

app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async(err, fields, files) => {
        if (err) {
            console.error(err)
            res.render('index', {
                msg: 'Error: No File Selected!'
              });
          }
          else{
          const fileContent = fs.readFileSync(files.myImage.path)
          const response = await  textExtractionController(fileContent);
          console.log(response);
          if(response.error){
            res.render('index', {
              msg: 'Error encountered while extracting text!'
            });
          }
          else{
            res.render('index', {
              result: response
            });
          }
        } 
        // res.render('index', {
        //   msg: 'File Selected!'
        // });
    });

});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
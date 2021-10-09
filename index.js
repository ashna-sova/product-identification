require('dotenv').config()
const express = require('express');
const formidable = require('formidable');
const fs = require("fs");
const textExtractionController = require('./controllers/text-extraction');
const classifyProductHelper = require('./helpers/classify-product');

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
          else if(response.payload.length===0){
            res.render('index', {
              msg: 'No relevant data found!'
            });
          }
          else{
            const classifiedData = classifyProductHelper(response.payload);
            console.log( classifiedData);
            if(classifiedData.error){
              res.render('index', {
                result: classifiedData.msg
              });
            }
            else{
              res.render('index',{
                nutrientMaps: classifiedData.payload.nutrientMaps,
                recommendationStatus: classifiedData.payload.recommendationStatus
              })
            }
          }
        } 
        // res.render('index', {
        //   msg: 'File Selected!'
        // });
    });

});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));

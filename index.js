const express = require('express')
var cors = require('cors')
const connectToMongo = require('./db');
const multer = require('multer');
const path = require('path');

connectToMongo();
const app = express()
const port = process.env.PORT || 8000;

app.use(cors())
app.use(express.json())

// // Setup multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

// // Image upload route
// app.post('/api/upload', upload.single('image'), (req, res) => {
//     if (req.file) {
//         res.json({ imageUrl: `/uploads/${req.file.filename}` });
//     } else {
//         res.status(400).send('No file uploaded');
//     }
// });


var storage = multer.diskStorage({

    destination: "./public/images",
    filename: function (req, file, cb) {
    cb(null, Date.now() + '-' +file.originalname )
    }
    })
    
    
    
    var upload = multer({ storage: storage }).array('file');
    
    
    app.post('/public/upload',function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)
    
    })
    
    });


// Avialiable routes
app.use('/public/images', express.static(__dirname + '/public/images/'));
app.use('/api/auth', require('./routes/auth'))
app.use('/api/service', require('./routes/service'))
app.use('/api/clients', require('./routes/clients'))

app.listen(port, () => {
    console.log(`gmls backend listening on port http://localhost:${port}`)
})

const express = require('express')
var router = express.Router();
const axios = require('axios');
var User = require('../modals/User');
var UserCsv = require('../modals/UserCsv');
const Downloader = require("nodejs-file-downloader");
const Fs = require('fs');
const CsvReadableStream = require('csv-reader');
var async = require('async');

//populate data from get url 
router.get('/populateurl', function (req, res) {
    //File download and import into user
    axios.get('https://jsonplaceholder.typicode.com/comments')
        .then(async function (response) {
            // handle success
            response.data.forEach(e => {
                let userData = new User(e);
                userData.save();
            });
            res.status(200).send("Sucessfully inserted");
        })
})


router.get('/populatefromcsv', function (req, res) {

    // Csv file file download in local then read and insert into UserCsv
    (async () => {

        const downloader = new Downloader({
            url: "http://console.mbwebportal.com/deepak/csvdata.csv",
            directory: "./downloads",
        });
        try {
            const { filePath, downloadStatus } = await downloader.download();

            console.log("File Move to local done", filePath);
            // file read start
            let inputStream = Fs.createReadStream(filePath, 'utf8');

            inputStream
                .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
                .on('data', function (row) {
                    let userData = new UserCsv({
                        postId: row[0],
                        id: row[1],
                        body: row[2],
                        name: row[3],
                        email: row[4]
                    });
                    userData.save();
                    
                })
                .on('end', function () {
                    console.log('No more rows!');
                });
                res.status(200).send("Sucessfully inserted");
        } catch (error) {
            res.status(200).send("file data not inserted");
        }
    })();
})

// parallel Task also Working 
router.get('/populateparallel', function (req, res) {
    async.parallel({
        one: function (callback) {
            //File download and import into user
            axios.get('https://jsonplaceholder.typicode.com/comments')
                .then(async function (response) {
                    let arrayData = [];
                    response.data.forEach(e => {
                        let userData = new User(e);
                        userData.save();
                    });
                    callback(null, 'task one File read');
                })

        },
        two: async function (callback) {
            const downloader = new Downloader({
                url: "http://console.mbwebportal.com/deepak/csvdata.csv",
                directory: "./downloads",
            });
            const { filePath, downloadStatus } = await downloader.download();

            console.log("File Move to local done", filePath);
            // file read start
            let inputStream = Fs.createReadStream(filePath, 'utf8');

            inputStream
                .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
                .on('data', function (row) {
                    let userData = new UserCsv({
                        postId: row[0],
                        id: row[1],
                        body: row[2],
                        name: row[3],
                        email: row[4]
                    });
                    userData.save();
                    
                })
                .on('end', function () {
                    console.log('No more rows!');
                });
                callback(null, 'Task 2 done');
        }
    }, function (err, results) {
        res.send("sucess");
    });

})

router.post('/search', async function (req, res) {

    let searchText = req.body.name;
    let data;
    if (searchText != '') {
        data = await User.find({
            name:{'$regex': searchText}
        }).sort({ name: 1 }).limit(10);;
    } else {
        data = await User.find({}).sort({ name: 1 }).limit(10);
    }
    res.json(data);
})
module.exports = router;
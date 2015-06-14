var fs = require('fs');

function serveFileStream() {
    'use strict';
    console.log('Serving from caché', req.url, fileName);
    res.setHeader("Content-Type", "text/html");
    fs.createReadStream(filePath).pipe(res);
}

exports.cache = function(req, res, next) {
    'use strict';
    // Check if the user is logged
    if (req.session.user === undefined) {
        // serve cache only to registered users
        var miliseconds = 3600000; // 1h
        var fileName = md5(req.url);
        var filePath = __dirname + "/cache/" + fileName;
        fs.exists(filePath, function(exists) {
            if (exists) {
                fs.stat(filePath, function(err, stats) {
                    var now = new Date();
                    var diff = now - stats.mtime;
                    if (diff < miliseconds) {
                        serveFileStream();
                    } else {
                        console.log("Old cache file", req.url, fileName);
                        next();
                    }
                });
            } else {
                console.log("Not cached", req.url);
                next();
            }
        });
    } else {
        console.log("User session - not cached", req.url);
        next();
    }

};

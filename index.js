var fs = require('fs');
var md5 = require('MD5');

function serveFileStream() {
    'use strict';
    console.log('Serving from caché', req.url, fileName);
    res.setHeader("Content-Type", "text/html");
    fs.createReadStream(filePath).pipe(res);
}

module.exports = function cache(options) {
    'use strict';
    options = options || {
        "path": "/tmp",
        "ttl": 3600000
    };
    return function(req, res, next) {
        // Check if the user is logged
        if (req.session.user === undefined) {
            // serve cache only to registered users
            var fileName = md5(req.url);
            var filePath = options.path + "/" + fileName;
            fs.exists(filePath, function(exists) {
                if (exists) {
                    fs.stat(filePath, function(err, stats) {
                        var now = new Date();
                        var diff = now - stats.mtime;
                        if (diff < options.ttl) {
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
    }
};

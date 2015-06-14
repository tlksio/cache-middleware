var fs = require('fs');
var md5 = require('MD5');

var defaultOptions = {
    "path": "/tmp",
    "ttl": 3600000
}

module.exports = function cache(options) {
    'use strict';
    options = options || defaultOptions;
    return function(req, res, next) {
        // Check if the user is logged
        if (req.session.user === undefined) {
            var url = req.url;
            var fileName = md5(url);
            var filePath = options.path + "/" + fileName;
            // check if a cached copy exists
            fs.exists(filePath, function(exists) {
                if (exists) {
                    // check if the if the file is older than the TTL
                    fs.stat(filePath, function(err, stats) {
                        var now = new Date();
                        var diff = now - stats.mtime;
                        if (diff < options.ttl) {
                            console.log('Serving from caché', url, fileName);
                            res.setHeader("Content-Type", "text/html");
                            fs.createReadStream(filePath).pipe(res);
                        } else {
                            console.log("Old cache file", url, fileName);
                            next();
                        }
                    });
                } else {
                    console.log("Not cached", url);
                    next();
                }
            });
        } else {
            // serve cache only to registered users
            console.log("User session - not cached", url);
            next();
        }
    };
};

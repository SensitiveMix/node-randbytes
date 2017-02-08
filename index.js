let timerandom = require('./lib/timerandom');
let urandom = require('./lib/urandom');
module.exports = {
    timeRandom: timerandom,
    urandom: urandom,
    getRandomBytes: function(cant, cb) {
        var randSource;
        randSource = urandom.getInstance();
        return randSource.getRandomBytes(cant, cb);
    },
    getHighRandomSource: function() {
        return new urandom({
            filePath: '/dev/random'
        });
    }
};

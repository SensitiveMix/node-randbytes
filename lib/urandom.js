// Generated by CoffeeScript 1.4.0
(function() {
  var UrandomGenerator, fs, instance;

  fs = require('fs');

  instance = null;

  UrandomGenerator = (function() {
    var buffer, buffersize, checkPromises, promises, srcfile;

    srcfile = null;

    buffer = '';

    promises = [];

    buffersize = 1024;

    UrandomGenerator.getInstance = function() {
      if (!instance) {
        instance = new UrandomGenerator();
      }
      return instance;
    };

    checkPromises = function() {
      var falta, mpromise;
      while (promises.length) {
        mpromise = promises.shift();
        falta = mpromise.bytes - mpromise.buffer.length;
        if (falta > buffer.length) {
          mpromise.buffer += buffer;
          promises.push(mpromise);
          buffer = '';
          break;
        } else {
          mpromise.buffer += buffer.substr(0, falta);
          buffer = buffer.substr(falta);
          mpromise.callback(new Buffer(mpromise.buffer, 'binary'));
          mpromise = null;
        }
      }
      if (buffer.length < buffersize) {
        return srcfile.resume();
      }
    };

    function UrandomGenerator(options) {
      var _ref, _ref1;
      if (options == null) {
        options = {};
      }
      buffersize = (_ref = options.bufferSize) != null ? _ref : 1024;
      options.filePath = (_ref1 = options.filePath) != null ? _ref1 : '/dev/urandom';
      srcfile = new fs.createReadStream(options.filePath, {
        encoding: 'binary',
        bufferSize: buffersize
      });
      srcfile.on('data', function(data) {
        var falta;
        falta = buffersize - buffer.length;
        if (falta === 0) {
          srcfile.pause();
          return;
        }
        if (data.length > falta) {
          data = data.slice(0, falta);
        }
        buffer += data.toString('binary');
        return checkPromises();
      });
    }

    UrandomGenerator.prototype.getRandomBytes = function(bytes, callback) {
      var buf;
      if (buffer.length < bytes) {
        buf = buffer;
        buffer = '';
        promises.push({
          buffer: buf,
          bytes: bytes,
          callback: callback
        });
      } else {
        callback(new Buffer(buffer.substr(0, bytes), 'binary'));
        buffer = buffer.substr(bytes);
      }
      return srcfile.resume();
    };

    return UrandomGenerator;

  })();

  module.exports = UrandomGenerator;

}).call(this);

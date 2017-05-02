var gm = require('gm'), imageMagick = gm.subClass({ imageMagick: true });

exports.convertToPng = function(req, res, next) {
  var svgString =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + req.params.svg;
  var buf = new Buffer(svgString);
  res.set('Content-Type', 'image/png');
  imageMagick(buf, './tmp/svg.svg').stream('png', function(
    err,
    stdout,
    stderr
  ) {
    console.log(err);
    stderr.pipe(process.stderr);
  });
};

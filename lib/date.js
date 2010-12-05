// Simple workaround for older JavaScript engines that
// do not understand the One True Date Format.
// This doesn't totally mimic new Date(), just string parsing.
exports.newDate = function (rfc3399) {
    var temp = Date.parse(rfc3399);
    if (isNaN(temp)) {
      // this technique is borrowed from jquery.couch.app.util's $.prettyDate
      temp = rfc3399.replace(/-/g,"/").replace("T", " ").replace("Z", " +0000").replace(/(\d*\:\d*:\d*)\.\d*/g,"$1");
    }
    return new Date(temp);
}

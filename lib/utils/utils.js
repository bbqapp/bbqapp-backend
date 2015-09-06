function matchImageOrVideo(contentType) {
  if (contentType.match(/image\/.*/) || contentType.match(/video\/.*/)) {
    return true;
  } else {
    return false;
  }
}

function isImageOrVideo(req) {
  return matchImageOrVideo(req.get('Content-Type'));
}


module.exports.isImageOrVideo = isImageOrVideo;
module.exports.matchImageOrVideo = matchImageOrVideo;

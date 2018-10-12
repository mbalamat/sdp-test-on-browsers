// Requests video from client2
var pc = new RTCPeerConnection();

pc.addEventListener('icegatheringstatechange', function() {
  console.warn("iceGatheringState");
  console.warn(pc.iceGatheringState);
}, false);
pc.addEventListener('iceconnectionstatechange', function() {
  console.warn("iceConnectionStateChange");
  console.warn(pc.iceConnectionState);
}, false);
pc.addEventListener('signalingstatechange', function() {
  console.warn("signalingStateChange");
  console.warn(pc.signalingState);
}, false);
pc.addEventListener('track', function(evt) {
  console.log('incoming track')
  console.log(evt);
  if (evt.track.kind == 'video') {
    document.getElementById('video').srcObject = evt.streams[0];
    console.log('video elem added');
  } else {
    document.getElementById('audio').srcObject = evt.streams[0];
  }
});

function negotiate() {
  return pc.createOffer({offerToReceiveVideo: true, offerToReceiveAudio: false}).then(function(offer) {
    return pc.setLocalDescription(offer);
  }).then(function() {
    return new Promise(function(resolve) {
      if (pc.iceGatheringState === 'complete') {
        resolve();
      } else {
        function checkState() {
          if (pc.iceGatheringState === 'complete') {
            pc.removeEventListener('icegatheringstatechange', checkState);
            resolve();
          }
        }
        pc.addEventListener('icegatheringstatechange', checkState);
      }
    });
  }).then(function() {
    var offer = pc.localDescription;
    console.log('Offer SDP');
    console.log(offer.sdp);
    document.getElementById('offerArea').value = offer.sdp;
    setLocalDescription();
  }).catch(function(e) {
    alert(e);
  });
}

function setAnswer(){
  var answerSDP = document.getElementById("answerArea").value;
  var obj = new RTCSessionDescription({type: "answer", sdp: answerSDP});
  pc.setRemoteDescription(obj);
}
function setLocalDescription(){
  document.getElementById("localDescription").value = pc.localDescription.sdp;
}

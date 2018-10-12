var pc = new RTCPeerConnection();
var camStream;
navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(
  (stream) => {
    camStream = stream;
  });

  pc.addEventListener('icegatheringstatechange', function() {
    console.warn("iceGatheringStateChange");
    console.warn(pc.iceGatheringState);
  }, false);
  pc.addEventListener('iceconnectionstatechange', function() {
    console.warn("iceConnectionStateChange");
    console.warn(pc.iceConnectionState);
  }, false);
  pc.addEventListener('signalingstatechange', function() {
    console.warn("signallingStateChange");
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

  function setOffer() {
    // get remote party's offer and set it as remote description
    pc.addTrack(camStream.getTracks()[0]);
    var othersOffer = document.getElementById("remoteDescription").value;
    var obj = new RTCSessionDescription({type: "offer", sdp: othersOffer});
    console.log("my rtcsessiondesc:");
    console.log(obj);
    pc.setRemoteDescription(obj).then(() => {
      return pc.createAnswer();
    }).then((answer) => {
      pc.setLocalDescription(answer);
    }).then(() => {
      console.log(pc.localDescription);
      document.getElementById("localDescription").value = pc.localDescription.sdp;
    }).catch((e) => {
      console.error(e);
    });
  }

LineStream = new Meteor.Stream('lines');

if(Meteor.isServer) {
  //map subscriptionId and the padId he is listening to
  var subscriptionPadsMap = {};
  LineStream.on('pad', function(padId) {
    var subscriptionId = this.subscriptionId;
    subscriptionPadsMap[subscriptionId] = padId;

    this.onDisconnect = function() {
      subscriptionPadsMap[subscriptionId] = undefined;
    };
  });

  LineStream.permissions.read(function(event) {
    //getting padId from the event
    var matched = event.match(/(.*):/);
    if(matched) {
      var padId = matched[1];
      //only allow events with padId where subscription is interestedIn
      return subscriptionPadsMap[this.subscriptionId] == padId;
    } else {
      //only allows events with padId to read from the stream
      return false;
    }
  }, false);

  LineStream.permissions.write(function(event) {
    return true;
  });
}
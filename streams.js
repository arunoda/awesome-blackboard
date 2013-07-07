LineStream = new Meteor.Stream('lines');

if(Meteor.isServer) {
  LineStream.permissions.read(function() {
    return true;
  });

  LineStream.permissions.write(function() {
    return true;
  });
}
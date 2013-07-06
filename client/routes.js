Meteor.Router.add({
  '/': function() {
    var newPadId = Random.id();
    location.href = '/' + newPadId;
  },

  '/:padId': {
    as: 'pad',
    to: function(padId) {
      Session.set('padId', padId);
      return 'pad'
    }
  }
});
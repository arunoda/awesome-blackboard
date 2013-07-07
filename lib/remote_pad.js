if(!Meteor.isClient) return;

this.RemotePad = function RemotePad(padId, pad) {
  var users = {};

  //listening on the dragstart event for the given padId
  LineStream.on(padId + ':dragstart', function(nickname, position, color) {
    //display the nickname pointer on the screen as remote user draws on the pad
    var pointer = $($('#tmpl-nickname').text());
    pointer.text(nickname);
    positionPointer(pointer, position);

    $('body').append(pointer);

    users[nickname] = {
      color: color, 
      from: position,
      pointer: pointer
    };
  });

  //listening on the dragend event for the given padId
  LineStream.on(padId + ':dragend', function(nickname) {
    //cleaning at the dragend
    var user = users[nickname];
    if(user) {
      user.pointer.remove();
      users[nickname] = undefined;
    }
  });

  //listening on the drag event for the given padId
  LineStream.on(padId + ':drag', function(nickname, to) {
    var user = users[nickname];
    if(user) {
      //when remote user is dragging, do the same here and re-position the nickname pointer
      pad.drawLine(user.from, to, user.color);
      positionPointer(user.pointer, to);
      user.from = to;
    }
  });

  // listening on the wipe event and wipe the blackboard
  LineStream.on(padId + ':wipe', function(nickname) {
    pad.wipe();
  });

  function positionPointer(pointer, position) {
    pointer.css({
      top: position.y + 10,
      left: position.x + 10
    });
  }

  this.close = function() {
    //remove all the listeners, when closing
    LineStream.removeAllListeners(padId + ':dragstart');
    LineStream.removeAllListeners(padId + ':dragend');
    LineStream.removeAllListeners(padId + ':drag');
    LineStream.removeAllListeners(padId + ':wipe');
  };
}
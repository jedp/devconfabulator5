(function() {
  // Wait for dom to be ready before binding any listeners
  $('document').ready(function() {

    // The global io object is exposed by socket.io.js
    var socket = io.connect();

    // Print a message when it arrives
    socket.on('message', function(message) {
      $('#messages').prepend('<li class="message">'
                             +'<span class="from">' + message.from + '</span>'
                             +'<span class="text">' + message.text + '</span>'
                             +'</li>');
    });

    function sendText() {
      var text = $('#input').val().trim();

      // If there is text, send and clear input
      if (!!text) {
        socket.json.send({text: text});
        $('#input').val("");
      }
    }

    // Send a message when enter is pressed in the input field
    $('#input').bind('keydown', function(evt) {
      var code = (evt.keyCode ? evt.keyCode : evt.which);

      // The Enter key
      if (code === 13) {
        evt.preventDefault();
        sendText();
      }
    });

    $('#send').click(sendText);

    $('#content').hide();
    $('#signin').show();
    $('#signout').hide();

    navigator.id.watch({
      onlogin: function(assertion) {
        $.post('/login', {assertion: assertion}, function(data) {
          // logged in!
          $('#signin').hide();
          $('#signout').show();
          $('#content').show();
          if (data.result.email) {
            socket.json.send({type: 'nick', text: data.result.email.split('@')[0]});
          }
        });
      },

      onlogout: function() {
        $('#signout').hide();
        $('#signin').show();
        $('#content').hide();
      }
    });

    $('#signin').click(function() {
      navigator.id.request();
    });

    $('#signout').click(function() {
      navigator.id.logout();
    });

  });
})();

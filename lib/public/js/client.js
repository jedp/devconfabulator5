(function() {
  // Wait for dom to be ready before binding any listeners
  $('document').ready(function() {

    // The global io object is exposed by socket.io.js
    var socket = io.connect();

    // Print a message when it arrives
    socket.on('message', function(message) {
      $('#messages').append('<li class="message">'
                           +'<span class="from">' + message.from + '</span>'
                           +'<span class="text">' + message.text + '</span>'
                           +'</li>');
    });

    // Send a message when enter is pressed in the input field
    $('#input').bind('keydown', function(evt) {
      var code = (evt.keyCode ? evt.keyCode : evt.which);

      // Enter key
      if (code === 13) {
        evt.preventDefault();
        var text = $('#input').val().trim();

        // If there is text, send and clear input
        if (!!text) {
          socket.json.send({text: text});
          $('#input').val("");
        }
      }
    });

  });
})();

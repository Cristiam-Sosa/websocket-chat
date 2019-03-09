// var stompClient = null;
//
// function setConnected(connected) {
//   document.getElementById('connect').disabled = connected;
//   document.getElementById('disconnect').disabled = !connected;
//   document.getElementById('conversationDiv').style.visibility
//       = connected ? 'visible' : 'hidden';
//   document.getElementById('response').innerHTML = '';
// }
//
// function connect() {
//   var socket = new SockJS('/chat');
//   stompClient = Stomp.over(socket);
//   stompClient.connect({}, function(frame) {
//     setConnected(true);
//     console.log('Connected: ' + frame);
//     stompClient.subscribe('/topic/messages', function(messageOutput) {
//       showMessageOutput(JSON.parse(messageOutput.body));
//     });
//   });
// }
//
// function disconnect() {
//   if(stompClient != null) {
//     stompClient.disconnect();
//   }
//   setConnected(false);
//   console.log("Disconnected");
// }
//
// function sendMessage() {
//   var from = document.getElementById('from').value;
//   var text = document.getElementById('text').value;
//   stompClient.send("/app/chat", {},
//       JSON.stringify({'from':from, 'text':text}));
// }
//
// function showMessageOutput(messageOutput) {
//   var response = document.getElementById('response');
//   var p = document.createElement('p');
//   p.style.wordWrap = 'break-word';
//   p.appendChild(document.createTextNode(messageOutput.from + ": "
//       + messageOutput.text + " (" + messageOutput.time + ")"));
//   response.appendChild(p);
// }

let stompClient = null;
let nickname = null;

$(document).ready(function () {
  $('#chat').hide();
});

$('#connectBtn').click(function () {
  nickname = $('#nicknameInp').val();
  $('#nicknameLbl').text(nickname);

  const socket = new SockJS('/innocv-chat');
  stompClient = Stomp.over(socket);
  stompClient.connect({}, onConnect);
});

function onConnect() {
  $('#login').hide();
  $('#chat').show();

  stompClient.subscribe('/topic/user', addUser);
  stompClient.subscribe('/topic/general', addMessageToGeneral);
  stompClient.subscribe('/topic/private', addMessageToPrivate);

  stompClient.send('/app/connected', {}, nickname);
}

$('#disconnectBtn').click(function () {
  if (stompClient) {
    stompClient.disconnect();
    $('#chat').hide();
    $('#login').show();
  }
});

$('#send').click(function () {
  const users = $('#users').val();
  const messageText = $('#messageInp').val();

  const message = {
    from: nickname,
    text: messageText,
    to: users
  };

  stompClient.send('/app/message', {}, JSON.stringify(message));
});

function addUser(response) {
  const userLine = `<option>${response.body}</option>`;
  $('#users').append(userLine);
}

function addMessageToGeneral(response) {
  const message = JSON.parse(response.body);
  const messageLine = `<p><b>${message.from}:</b> ${message.text}</p>`;
  $('#generalChannel').append(messageLine);
}

function addMessageToPrivate(response) {
  const message = JSON.parse(response.body);
  const messageLine = `<p><b>${message.from}:</b> ${message.text}</p>`;
  $('#privateChannel').append(messageLine);
}

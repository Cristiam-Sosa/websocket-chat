
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

  stompClient.subscribe('/topic/all/user', addUser);
  stompClient.subscribe(`/topic/${nickname}/user`, addUser);
  stompClient.subscribe('/topic/general', addMessageToGeneral);
  stompClient.subscribe(`/topic/${nickname}`, addMessageToPrivate);

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

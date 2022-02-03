const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');

// get username and room for the URL
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// join the chatroom
socket.emit('joinRoom', { username });

// get the users
socket.on('roomUsers', ({ users }) => {
  outputUsers(users);
});

// server messages
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // scrolling
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// sending messages
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // emit message to server
  socket.emit('chatMessage', msg);

  // clear input after emitting
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// output the message
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// show the users
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

// prompt the user before leaving
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});

var socket = io('http://localhost:8000');
const form=document.getElementById("form_submission");
const message_inp=document.getElementById("input");
const message_container=document.querySelector(".container");
var audio=new Audio('sms_notification.mp3');
var audio1=new Audio('sound1.mp3');

const append=(message,position)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    message_container.append(messageElement);
    message_container.scrollTop=message_container.scrollHeight;
    if(position=='right')
    audio1.play();
    else audio.play();
}


form.addEventListener('submit',(e)=>{
  e.preventDefault();    //The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur. For example, this can be useful when:  Clicking on a "Submit" button, prevent it from submitting a form ,Clicking on a link, prevent the link from following the URL
  const message=message_inp.value;
  append(`You: ${message}`,'right');
  let person=prompt("enter the person you want to send the message");
  if(person=='everyone')
  socket.emit('send',message);
  else 
  socket.emit('send_personal',{person,message});
  message_inp.value="";
  message_container.scrollTop=message_container.scrollHeight;

})

let nam=prompt("enter yout name to join");
socket.emit('new-user-joined',nam);

socket.on('recieve',data=>{
  // console.log(`${data.name}`);
  append(`${data.name} : ${data.message}`,'left');

})

socket.on('user-joined',nam=>{
  append(`${nam} joined the chat`,'right');
})

socket.error(()=>{
    alert('no user with this name');
})

socket.on('left',nam=>{
    append(`${nam} left the chat`,'right');
})

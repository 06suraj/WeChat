// node sever which will handle socket io connections

const io = require('socket.io')(8000, {
  cors: {
    origin: '*',
  }
});// intialise the io to use socket io in 8000 port
// const io=require('socket.io')(80);

  // then we run socket io server which is an instance of http

const users={},persons={};   

// io server then listens incoming events 
io.on('connection',socket=>{           // io.on is a socket instance  which will listen mane socket connection
   socket.on('new-user-joined',nam=>{     // soclet.on handle the particular connection
         console.log("new user");
         users[socket.id]=nam;       // whenever user join event happen then a call back is execeuted then it append name to users
         persons[nam]=socket.id;
         socket.broadcast.emit('user-joined',nam)  // broadcast.emit sends a event or message to all users except new user 
   })

   socket.on('send',message=>{
       socket.broadcast.emit('recieve',{name:users[socket.id],message:message});
   })

   socket.on('send_personal',data=>{
    //  console.log(data.person);
     let id=persons[data.person],message=data.message;
     console.log(id);
    if(id==undefined)socket.to(socket.id).emit('error');
    else
    socket.to(id).emit('recieve',{name:users[id],message});
})

   socket.on('disconnect',message=>{
    socket.broadcast.emit('left',users[socket.id]);
    delete users[socket.id];
})
})

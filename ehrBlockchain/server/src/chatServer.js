const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const uuid = require('uuid');
const http=require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
let network = require('./fabric/network.js');


var app = express();
var server = http.createServer(app);
var io = socketio.listen(server);

app.set('socketio',io);
app.set('server', server);


const {
    v4
} = require('uuid');

app.use(cors);

let msg=require('./models/messageM')
mongoose.connect('mongodb+srv://m001-student:mBVI3SbOLiX22EPT@avinash-001-q92dl.mongodb.net/blockchain?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(res => console.log('db connected'))
    .catch(e => console.log(e));

let room="";

io.on("connection", socket => {
    console.log("user connected");
  
    socket.on("disconnect", function() {
      console.log("user disconnected");
    });

    socket.on("typing", data => {
        socket.broadcast.emit("notifyTyping", {
          user: data.user,
          message: data.message
        });
    });

    socket.on('docack',(mesg)=>{
        let room=mesg;
        socket.join(room,()=>{
            io.in(room).emit('docackback',"joined room");
            msg.findOne({room}).then(res=>{
                if(!res){
                io.in(room).emit('docdbupdate',"start your conversation please");
                }
                else{
                console.log(res.msg);
                io.in(room).emit('docdbupdate',res.msg);
              }
            })
        });
    })

    socket.on('patack',(mesg)=>{
        let room=mesg;
        socket.join(room,()=>{
            io.in(room).emit('patackback',"joined room");
            msg.findOne({room}).then(res=>{
                if(!res){
                io.in(room).emit('patdbupdate',"start your conversation please");
                }
                else{
                console.log(res.msg);
                io.in(room).emit('patdbupdate',res.msg);
              }
            })
        });
    })

    socket.on('chat message',(data)=>{
        io.in(data.room).emit('received',data);
        msg.findOne({room:data.room}).then((res)=>{
            if(!res){
                let mesg=new msg({room:data.room,msg:[data.content]})
                mesg.save();
            }
            else{
                res.msg.push(data.content);
                msg.findOneAndUpdate({room:data.room},res).then(()=>{

                })
            }
        })
        
    })





    
      //when soemone stops typing
      socket.on("stopTyping", () => {
        socket.broadcast.emit("notifyStopTyping");
      });

});



app.get('server').listen(3001,()=>{
    console.log('chat server started');
});

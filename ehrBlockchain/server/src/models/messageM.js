const mongoose=require('mongoose');

let Schema=mongoose.Schema;

var messageSchema = new Schema({
    room:String,
    msg:[{
        message:String,
        time:Date,
        from:String,
    }]
  });

module.exports=mongoose.model('msg',messageSchema,'msg');
const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  
   section:{
        type:String,
   },
   SubSection:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true
        }
   ],
    
});

module.exports = mongoose.model("Section", sectionSchema);

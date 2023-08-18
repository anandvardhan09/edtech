const mongoose = require("mongoose");

const courseProgress = new mongoose.Schema({
  
    courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"course",
    },
    completedVideos:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Subsection",
        }
    ]
    
});

module.exports = mongoose.model("courseProgress", courseProgress);

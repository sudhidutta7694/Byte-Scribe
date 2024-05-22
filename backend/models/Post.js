const mongoose=require('mongoose')

const PostSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    desc:{
        type:String,
        required:true,
        unique:true
    },
    photo:{
        type:String,
        required:false,
        
    },
    username:{
        type:String,
        required:true,  
    },
    userId:{
        type:String,
        required:true,  
    },
    categories:{
        type:Array,
        required:false
    },
    approved:{
        type:Boolean,
        default:false,
        required:true
    },
    status: {
        type: String,
        enum: ['reviewing', 'pending', 'approved', 'rejected'],
        default: 'pending',
        required: true
    },
    suggestions: {
        type: String,
        required: false
    }

},{timestamps:true})

module.exports=mongoose.model("Post",PostSchema)
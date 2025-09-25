import mongoose from "mongoose";

const { Schema } = mongoose;

const RegisterDemoSchema = new Schema({
    formName : { type : String , required : true},
    fullName : { type : String , required : true }, 
    email :  { type : String , required : true },
    mobileNumber : { type : String , required : true },
    courseName : { type : String , required : true },
    message : { type : String , required : true }
})

export default mongoose.model('RegisterDemo',RegisterDemoSchema);
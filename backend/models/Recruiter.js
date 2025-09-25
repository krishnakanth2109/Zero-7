import mongoose from "mongoose";

const { Schema } = mongoose;

const RecruiterSchema = new Schema({
    email : { type : String , required : true },
    password : { type : String , required : true }
});

export default mongoose.model('Recruiter',RecruiterSchema);
import mongoose from "mongoose";

const { Schema } = mongoose;

const CollegeConnectSchema = new Schema({
    formName : { type : String , required : true },
    collegeName : { type : String , required : true },
    contactPerson : { type : String , required : true },
    Email : { type : String , required : true },
    Phone : { type : Number , required : true },
    ProposalType : { type : String , required : true },
    Message : { type : String , required : true },
});

export default mongoose.model('CollegeConnect', CollegeConnectSchema);
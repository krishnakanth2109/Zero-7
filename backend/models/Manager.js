import mongoose from "mongoose";

const { Schema } = mongoose;

const ManagerShema = new Schema({
    name : { type : String , required : true },
    assigned_Company : { type : String , required : true },
    age : { type : Number , required : true},
    phone : { type : String , required : true },
    employeeID : { type : String , required : true },
    email : { type : String , required : true },
    password : { type : String , required : true},
})

export default mongoose.model('Manager',ManagerShema);
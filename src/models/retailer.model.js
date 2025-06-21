import mongoose ,{Schema} from "mongoose";


const retailerSchema = new Schema({

    CustomerName:{
        type:String,
        required:true,
        
    },
    ContactNumber:{
        type:String,
        default:"None"
    },
    GSTNumber : {
    type:String,
    default:"None",
   
    },
    Address:{
        type:String,
        default:"None"
    }
})

export const retailer = mongoose.model("retailer",retailerSchema)
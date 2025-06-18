import mongoose ,{Schema} from "mongoose";


const retailerSchema = new Schema({

    RetailerName:{
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
    unique: true
    },
    Address:{
        type:String,
        default:"None"
    }
})

export const retailer = mongoose.model("retailer",retailerSchema)
import mongoose, {Schema} from "mongoose";


const productSchema = new Schema({

  
    productName:{
       type:String,
       required : true,
       lowercase:true,
       trim:true,
       index:true 
    },
    MRP:{
       type: Number,
       required:true,
       trim:true
    },
        PRICE:{
       type: Number,
       required:true,
       trim:true
    },
    TotalPurchased:{
        type:Number,
        default:0
    },
    TotalSold:{
        type:Number,
        default:0
    },
    landing:{
        type:Number,
        default:0
    },
    CurrentStock:{
        type:Number,
        default:0
    }
})


export const Product = mongoose.model("Product", productSchema )
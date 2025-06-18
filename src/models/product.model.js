import mongoose, {Schema} from "mongoose";


const productSchema = new Schema({

    productId:{
        type:Number,
        unique:true
    },
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
    }
})


export const Product = mongoose.model("Product", productSchema )
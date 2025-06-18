import mongoose, {Schema} from "mongoose";


const billSchema = new Schema({

    InvoiceNo:{
        type:Number
       
    },
    BillStatus:{
        type:String,
        default:"ACTIVE"
    },

    RetailerName:{
        type:String,
        required:true
    },
    ContactNumber:{
        type:String,
        default:"No Number"
    },
    GSTNumber:{
        type:String,
        default:"NULL"
    },
    Address:{
        type:String,
        default:"NULL",
    },
    PaymentMethod:{
        type:String,
        required:true
    },
    items:[{
        productName:{
            type:String
        },
        productMRP:{
            type:Number
        },
        productQuantity:{
            type:Number
        },
        productPRICE:{
            type:Number
        },
        productAmount:{
            type:Number
        }
    }],
    subTotal:{
        type:Number
    },
    Cgst:{
        type:Number
    },
    Sgst:{
        type:Number
    },
    roundOff:{
         type:Number
    },
    TotalAmount:{
        type:Number
    }
    


},{timestamps:true})

// billSchema.pre('save',async function(next){
//     try{
//         const currentInvoiceNumber = await (mongoose.model('billSchema').countDocuments())+1
//         this.InvoiceNo=currentInvoiceNumber
//         next()
//     }catch(error){
//         console.log(error)
//     }
// })

export const Bill = mongoose.model("Bill",billSchema)
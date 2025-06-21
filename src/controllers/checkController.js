import { stringify } from "querystring";
import { Bill } from "../models/bill.model.js";
import { Product } from "../models/product.model.js";
import { retailer } from "../models/retailer.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs"
import FormData from "form-data";
import fetch from 'node-fetch';

const fetchProductData = asyncHandler(async (req, res) => {
    const product = await Product.find()
    return res.status(200).json(new ApiResponse(200, product))
})

const newProduct = asyncHandler(async (req, res) => {
    // const _id = await Product.countDocuments() + 1
    const productName = req.body.name
    const MRP = req.body.mrp
    const PRICE = req.body.price
    const TotalPurchased=req.body.newStockNumber
    const CurrentStock = req.body.newStockNumber

    const product = await Product.create({
        productName,
        MRP,
        PRICE,
        TotalPurchased,
        CurrentStock
    })
    product.save();
    return res.status(200).json(new ApiResponse(200, product))
})

const newInventory = asyncHandler(async(req,res) => {
    const id = req.body.id
    const name = req.body.productName
    const Price = req.body.price
    const mrp = req.body.mrp
    const stock = req.body.newStockNumber
    // console.log(id,name,Price,mrp,stock)
     console.log(req.body)
    // console.log(stock)
    const prevStock =await  Product.findOne({_id:id})
    console.log(typeof(stock))
    const newTotal = parseInt(prevStock.TotalPurchased) + parseInt(stock)
    const newAvailableStock = parseInt(prevStock.CurrentStock) + parseInt(stock)
    const product = await Product.findOneAndUpdate({_id:id},{
        // productName: name,
        MRP: mrp,
        PRICE: Price,
        TotalPurchased:newTotal,
        CurrentStock:newAvailableStock
    })
   
    // product.save()
    return res.status(201).json(new ApiResponse(201,"updated"))

})

const newRetailer = asyncHandler(async (req, res) => {
    const CustomerName = req.body.CustomerName|| "CASH"
    const ContactNumber = req.body.retailerContactNumber || ""
    const Address = req.body.retaileraddress || ""
    const GSTNumber =  req.body.retailerGSTNumber || ""

// CustomerName,retailerContactNumber,retailerGSTNumber,retaileraddress

    const r = await retailer.create({
        CustomerName,
        ContactNumber,
        Address,
        GSTNumber
    })
    r.save();
    return res.status(200).json(new ApiResponse(200, r))

})

const fetchRetailers = asyncHandler(async (req, res) => {
    console.log("reached fetch retailers ")
    const data = await retailer.find()
    return res.status(200).json(new ApiResponse(200, data, "successfully fetched"))
})

const generateBill = asyncHandler(async (req, res) => {
    try {

        const Data = req.body.Order
        //  console.log(Data)
        const InvoiceNo = await Bill.countDocuments() + 1;
        const CustomerName = Data.CustomerName
        const ContactNumber = Data.retailerContactNumber
        const GSTNumber = Data.retailerGSTNumber
        const Address = Data.retaileraddress
        const PaymentMethod = Data.paymentMethod
        const items = Data.items
        // const productMetric = Data.productMetric
        let Cgst = Data.Cgst
        let Sgst = Data.Sgst
        let roundOff = Data.roundOff
        let subTotal = Data.SubTotal
        let TotalAmount = Data.TotalAmount
        // console.log(items)
        // const items = [{
        //     ProductName: Data.productName,
        //     ProductMRP:Data.productMRP,
        //     ProductQty:Data.productQuantity,
        //     ProductPrice:Data.productPRICE,
        //     ProductAmount:Data.productAmount
        // }]
       console.log(Data.items[0].productMetric)

        // console.log(InvoiceNo)
        const saveBill = await Bill.create({
            InvoiceNo,
            CustomerName,
            ContactNumber,
            GSTNumber,
            Address,
            PaymentMethod,
            items,
            subTotal,
            Cgst,
            Sgst,
            roundOff,
            TotalAmount
        })
        saveBill.save();

        return res.status(200).json(new ApiResponse(200, saveBill))
    } catch (error) {
        return res.status(400).json(new ApiResponse(400, error, "failed"))
    }
})

const fetchCurrentInvoiceNo = asyncHandler(async (req, res) => {
    let InvoiceNo = await Bill.countDocuments() ;

    return res.status(200).json(new ApiResponse(200, InvoiceNo))
})

const fetchCompleteBillThroughInvoice = asyncHandler(async (req, res) => {
    const BillNo = req.body.BillNo
    const data = await Bill.findOne({ InvoiceNo: BillNo })
    return res.status(200).json(new ApiResponse(200, data))
})


const fetchBillsThroughRetailerName = asyncHandler(async (req, res) => {
    console.log("asdads")
    const CustomerName = req.body.CustomerName
    const data = await Bill.find({ CustomerName: CustomerName }).select("CustomerName PaymentMethod TotalAmount createdAt InvoiceNo BillStatus ")
    console.log(data)
    return res.status(200).json(new ApiResponse(200, data))
})
const fetchBillsThroughInvoice = asyncHandler(async (req, res) => {
    console.log("asdads")
    const invoiceNo = req.body.invoiceNo
    const data = await Bill.find({ InvoiceNo: invoiceNo }).select("CustomerName PaymentMethod TotalAmount createdAt InvoiceNo BillStatus ")
    console.log(data)
    return res.status(200).json(new ApiResponse(200, data))
})

const updateStatus = asyncHandler(async (req, res) => {
    const invoiceNo = req.body.invoiceNo
    const newStatus = req.body.newStatus

    const bill = await Bill.findOneAndUpdate({ InvoiceNo: invoiceNo }, { BillStatus: newStatus })
    bill.save()
    return res.status(201).json(new ApiResponse(201, null, "Successfully Updated"))
})

const deleteProduct = asyncHandler(async (req, res) => {
    // const prodName = req.body.prodName
    const prodId = req.body._id
    console.log(prodId)
    const c = await Product.findOne({_id: prodId})
    const prodCheck = await Product.findOneAndDelete({ _id : c._id })
    
    // allProducts.forEach(async(product) => {
    //     product._id = ""
    //    await product.save()
    // })

    
    return res.status(200).json(new ApiResponse(200, prodCheck))

})
// id,name,mrp,price
const productDetailChanges = asyncHandler(async (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const mrp = req.body.mrp
    const price = req.body.price

    const d = await Product.findOneAndUpdate({ _id: id }, {
        productName: name,
        MRP: mrp,
        PRICE: price
    })
    let f = await Product.findOne({ _id: id })
    console.log(f)
    // await d.save()
    return res.status(200).json(new ApiResponse(200, f))
})

const sendBillOnWhatsApp = asyncHandler(async (req, res) => {
    try {
        const filePath = req.file.path
        const accessToken = process.env.WHATSAPP_ACCESS_TOKEN
        const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER
        console.log(accessToken, phoneNumberId)
        console.log(phoneNumberId)
        const customerPhoneNumber = "+91 8619804776"

        const mediaForm = new FormData()

        mediaForm.append("file", fs.createReadStream(filePath), {
            filename: "bill.png",         // force a filename with extension
            contentType: "image/png"      // manually tell it what this is
        });

        mediaForm.append("messaging_product", "whatsapp")
        console.log("🧾 File exists:", fs.existsSync(filePath));
        console.log("🧾 File type:", req.file.mimetype);
        console.log("📦 File size:", req.file.size);

        const mediaUploadresponse = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/media`, {
            method: "POST",
            headers: {
                ...mediaForm.getHeaders(),
                Authorization: `Bearer ${accessToken}`
            },
            body: mediaForm
        });

        const mediaData = await mediaUploadresponse.json();
        console.log("🔍 Media upload response:", mediaData);

        const mediaId = mediaData.id;

        // console.log("📦 Media ID:", mediaId);
        //       console.log("Response status:", mediaUploadresponse.status);
        // console.log("Response text:", await mediaUploadresponse.text());

        const send = await fetch(`https://graph.facebook.com/v22.0/${phoneNumberId}/messages`, {
            method: "POST",
            headers: {


                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: customerPhoneNumber,
                type: "template",
                
      template: {
        name: 'bill2',
        language: {
          code: 'en_us'
        },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'image',
                image: {
                  id: mediaId
                }
              },
             
            ]
          }
        ]
      }
    
                // text: { body: "hola" }
            })

        })
        const d = await send.json()
        console.log(d)
        return res.status(200).json(new ApiResponse(200, d))

    } catch (error) {
        console.log(error)
        return res.status(400).json(new ApiResponse(400, "failed"))
    }
})

const updateAvailableStock = asyncHandler(async (req,res) => {
    const data = req.body.newAvailableStock

    for(let product of data){
        console.log(product)
      let productId = product.productId
      let newStockValue= product.newStock
      let productData = await Product.findByIdAndUpdate({_id:productId},{
        CurrentStock:newStockValue
      })
      return res.status(200).json(new ApiResponse(200,productData))
    }
    
})

export {
    fetchProductData,
    newProduct,
    newRetailer,
    fetchRetailers,
    generateBill,
    fetchCurrentInvoiceNo,
    fetchCompleteBillThroughInvoice,
    fetchBillsThroughRetailerName,
    fetchBillsThroughInvoice,
    updateStatus,
    deleteProduct,
    productDetailChanges,
    sendBillOnWhatsApp,
    newInventory,
    updateAvailableStock
}
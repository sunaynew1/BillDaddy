import { stringify } from "querystring";
import { Bill } from "../models/bill.model.js";
import { Product } from "../models/product.model.js";
import { retailer } from "../models/retailer.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs"
import FormData from "form-data";
import fetch from 'node-fetch';

const check = asyncHandler(async (req, res) => {
    const product = await Product.find()
    return res.status(200).json(new ApiResponse(200, product, "successFully checked"))
})

const newProduct = asyncHandler(async (req, res) => {
    const productId = await Product.countDocuments() + 1
    const productName = req.body.productName
    const MRP = req.body.mrp
    const PRICE = req.body.price

    const product = await Product.create({
        productId,
        productName,
        MRP,
        PRICE
    })
    product.save();
    return res.status(200).json(new ApiResponse(200, product, "added"))
})

const newRetailer = asyncHandler(async (req, res) => {
    const RetailerName = "Gaurav Departmental Store"
    const ContactNumber = "+91 8619804776"
    const Address = "b76 lalkothi jaipur"

    const r = await retailer.create({
        RetailerName,
        ContactNumber,
        Address
    })
    r.save();
    return res.status(200).json(new ApiResponse(200, r, "successfully fetched"))

})

const fetchRetailers = asyncHandler(async (req, res) => {
    const data = await retailer.find()
    return res.status(200).json(new ApiResponse(200, data, "successfully fetched"))
})

const generateBill = asyncHandler(async (req, res) => {
    try {

        const Data = req.body.Order
        //  console.log(Data)
        const InvoiceNo = await Bill.countDocuments() + 1;
        const RetailerName = Data.retailerName
        const ContactNumber = Data.retailerContactNumber
        const GSTNumber = Data.retailerGSTNumber
        const Address = Data.retaileraddress
        const PaymentMethod = Data.paymentMethod
        const items = Data.items
        let Cgst = Data.Cgst
        let Sgst = Data.Sgst
        let roundOff = Data.roundOff
        let subTotal = Data.SubTotal
        let TotalAmount = Data.TotalAmount
        console.log(items)
        // const items = [{
        //     ProductName: Data.productName,
        //     ProductMRP:Data.productMRP,
        //     ProductQty:Data.productQuantity,
        //     ProductPrice:Data.productPRICE,
        //     ProductAmount:Data.productAmount
        // }]


        // console.log(InvoiceNo)
        const saveBill = await Bill.create({
            InvoiceNo,
            RetailerName,
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
    let InvoiceNo = await Bill.countDocuments() + 1;

    return res.status(200).json(new ApiResponse(200, InvoiceNo))
})

const fetchCompleteBillThroughInvoice = asyncHandler(async (req, res) => {
    const BillNo = req.body.BillNo
    const data = await Bill.findOne({ InvoiceNo: BillNo })
    return res.status(200).json(new ApiResponse(200, data))
})


const fetchBillsThroughRetailerName = asyncHandler(async (req, res) => {
    console.log("asdads")
    const retailerName = req.body.retailerName
    const data = await Bill.find({ RetailerName: retailerName }).select("RetailerName PaymentMethod TotalAmount createdAt InvoiceNo BillStatus ")
    console.log(data)
    return res.status(200).json(new ApiResponse(200, data))
})
const fetchBillsThroughInvoice = asyncHandler(async (req, res) => {
    console.log("asdads")
    const invoiceNo = req.body.invoiceNo
    const data = await Bill.find({ InvoiceNo: invoiceNo }).select("RetailerName PaymentMethod TotalAmount createdAt InvoiceNo BillStatus ")
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
    const prodName = req.body.prodName
    // const prodId = req.body.productId
    const check = await Product.findOneAndDelete({ productId: prodName })
    return res.status(200).json(new ApiResponse(200, check))

})
// id,name,mrp,price
const productDetailChanges = asyncHandler(async (req, res) => {
    const id = req.body.id
    const name = req.body.name
    const mrp = req.body.mrp
    const price = req.body.price

    const d = await Product.findOneAndUpdate({ productId: id }, {
        productName: name,
        MRP: mrp,
        PRICE: price
    })
    let f = await Product.findOne({ productId: id })
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
        const customerPhoneNumber = "+918619804776"

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
        name: 'bill',
        language: {
          code: 'en'
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

export {
    check,
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
    sendBillOnWhatsApp
}
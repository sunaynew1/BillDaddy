import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { check, fetchRetailers, newProduct, newRetailer,generateBill,fetchCurrentInvoiceNo, fetchCompleteBillThroughInvoice, fetchBillsThroughRetailerName, fetchBillsThroughInvoice, updateStatus ,deleteProduct,productDetailChanges,sendBillOnWhatsApp} from "../controllers/checkController.js";
import bodyParser from 'body-parser'
// import multer from "multer";

const router = Router()

router.route("/check").get(check)
router.route("/addProduct").post(newProduct)
router.route("/addRetailer").post(newRetailer)
router.route("/fetchRetailers").post(fetchRetailers)
router.route("/generateBill").post(generateBill)
router.route("/invoiceNo").post(fetchCurrentInvoiceNo)
router.route("/fetchCompleteBillThroughInvoice").post(fetchCompleteBillThroughInvoice)
router.route("/fetchBillsThroughRetailerName").post(fetchBillsThroughRetailerName)
router.route("/fetchBillsThroughInvoice").post(fetchBillsThroughInvoice)
router.route("/updateStatus").post(updateStatus)
router.route("/deleteProduct").post(deleteProduct)
router.route("/productDetailChanges").post(productDetailChanges)


router.route("/sendBillOnWhatsApp").post(
      upload.single("invoice"),
    sendBillOnWhatsApp)
// fetchBillsThroughInvoice
// deleteProduct
// productDetailChanges


// webhook.js



// ✅ VERIFY TOKEN - Facebook will call this during setup
router.route("/webhook").get( (req, res) => {
  const VERIFY_TOKEN = "asas";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
   return res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// ✅ RECEIVE MESSAGES
router.route("/webhook").post( (req, res) => {
  const body = req.body;
  console.log(JSON.stringify(body, null, 2));

  if (body.object) {
    // You can process message, delivery, read, etc.
   return res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

export default router;



import multer from "multer";
import path from "path";
import fs from "fs";

// Create an absolute path to the uploads folder
const uploadPath = "uploads";

// ✅ Make sure the 'uploads' directory exists
// if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
// }

const storage = multer.diskStorage({
    destination: "uploads/"
    // destination: function (req, file, cb) {
    //     cb(null, uploadPath); // ✅ Set the correct path
    // },
    // filename: function (req, file, cb) {
    // //     // Optional: keep original file name or create unique one
    // //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // //     cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g. 1623423.png
    // // }
    // }
});
console.log("multer")
const upload = multer({ storage });

export default upload;
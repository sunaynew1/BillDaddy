import express, { urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import router from "./routes/routes.js"

const app = express()
app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended: true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/api/v1/users", router);


export {app}

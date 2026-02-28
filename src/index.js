import express from "express"
import cors from "cors"
import morgan from "morgan"
import trackRouter from "./routes/track.route.js"
import { globalErrorHandler } from "./middlewares/error.middleware.js"

const app = express();

app.use(express.json()) 
app.use(morgan("dev"))
app.use(cors())


app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "music" })
})

app.use('/api/track', trackRouter)
app.use(globalErrorHandler)


export default app;
import express from "express"
import cors from "cors"
import morgan from "morgan"

const app = express();

app.use(express.json()) 
app.use(morgan("dev"))
app.use(cors())


app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "music" })
})

export default app;
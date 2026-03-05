import express from "express"
import cors from "cors"
import morgan from "morgan"
import trackRouter from "./routes/track.route.js"
import voteRouter from "./routes/vote.route.js"
import { globalErrorHandler } from "./middlewares/error.middleware.js"

const app = express();

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))
app.use(morgan("dev"))
app.use(cors())


app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "music" })
})

app.use('/api/tracks', trackRouter)
app.use('/api/votes', voteRouter);
app.use(globalErrorHandler)


export default app;
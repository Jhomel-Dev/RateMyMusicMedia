import app from "./index.js"
import Database from "./config/db.js";


const port = process.env.PORT || 3000

await Database.connectDb()

app.listen(port, () => {
    console.log(`server running on port: ${port}`)
})


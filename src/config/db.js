import mongoose from "mongoose";

export class Database {
    constructor() {
        this.connection = null;
    }
    async connectDb() {
        try {
            if (!process.env.MONGO_URI) {
                console.error("[Music Service]: MONGO_URI no está definida en las variables de entorno")
                process.exit(1)
            }
            await mongoose.connect(process.env.MONGO_URI)
            console.log("[Music Service]: MongoDB connected")
        } catch (error) {
            console.error("error al conectar la base de datos, revice la url: \n", error)
            process.exit(1)
        }
    }
}

const dbInstance = new Database();
export default dbInstance
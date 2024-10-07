import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "../logger/winston.logger.js";

dotenv.config();

export let dbInstance = undefined;

const connectDb = async() => {
    try{
        console.log(process.env.DB_URI)
        const connectionInstance = await mongoose.connect(
            `${process.env.DB_URI}`, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        dbInstance = connectionInstance;
        logger.info(
            `\n MongoDB Connected! Db host: ${connectionInstance.connection.host}\n`
        );
    }catch(error){
        logger.error("MongoDB connection error: ", error);
        process.exit(1);
    }
}

export default connectDb;
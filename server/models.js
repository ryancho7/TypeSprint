import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log("conecting to mongodb");
await mongoose.connect(process.env.MONGODB_URI);
console.log("Successfully connected to mongodb");

const models = {}

export default models
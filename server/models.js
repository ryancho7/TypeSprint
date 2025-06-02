import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log("conecting to mongodb");
await mongoose.connect(process.env.MONGODB_URI);
console.log("Successfully connected to mongodb");

const models = {}

const sentenceSchema = new mongoose.Schema({
    sentence: String
});

const raceHistorySchema = new mongoose.Schema({
    username: String,
    wpm: Number,
    finishingPosition: Number,
    date: Date,
});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

models.Sentence = mongoose.model('Sentence', sentenceSchema);
models.RaceHistory = mongoose.model('RaceHistory', raceHistorySchema);
models.User = mongoose.model('User', userSchema);

export default models
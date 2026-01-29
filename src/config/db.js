import 'dotenv/config';
import mongoose from 'mongoose';

const mongoClient = await mongoose.connect(
  process.env.MONGODB_URI,
);

export default mongoClient;


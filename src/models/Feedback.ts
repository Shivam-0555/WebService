import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface FeedbackDocument extends Document {
  name: string;
  rating: number;
  message: string;
  createdAt: Date;
}

const feedbackSchema = new Schema<FeedbackDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true },
);

export const Feedback: Model<FeedbackDocument> = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

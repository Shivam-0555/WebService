import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface EnquiryDocument extends Document {
  name: string;
  email: string;
  phone: string;
  websiteType: string;
  budget: string;
  requirements: string;
  status: "new" | "in-progress" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<EnquiryDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 160 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    websiteType: { type: String, required: true, trim: true, maxlength: 80 },
    budget: { type: String, required: true, trim: true, maxlength: 80 },
    requirements: { type: String, required: true, trim: true, maxlength: 3000 },
    status: { type: String, enum: ["new", "in-progress", "closed"], default: "new" },
  },
  { timestamps: true },
);

export const Enquiry: Model<EnquiryDocument> = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);

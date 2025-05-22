import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    url: { type: String, required: true },
    transcript: { type: String, default: "No speech detected" },
    marks: { type: Number, required: true },    // new
    comment: { type: String, required: true },  // new
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const videoSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // or String if your userId is string
      required: true,
      unique: true, // one document per user
      ref: "User",
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

export default mongoose.models.VideoSession ||
  mongoose.model("VideoSession", videoSessionSchema);

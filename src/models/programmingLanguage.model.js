import mongoose from "mongoose";

const programmingLanguageSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String
  },
  img: {
    type: String,
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

export const ProgrammingLanguage = mongoose.model('ProgrammingLanguage', programmingLanguageSchema);

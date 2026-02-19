import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir un nom de catégorie.'],
    unique: true, // Évite d'avoir deux catégories avec le même nom
    trim: true,
  },
  description: {
    type: String,
    default: '',
  }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
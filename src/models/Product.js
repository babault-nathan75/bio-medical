import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez fournir le nom du médicament ou soin.'],
    trim: true,
  },
  description: {
    type: String,
    required: [false],
    maxLength: [500, 'La description ne peut pas dépasser 500 caractères.'],
  },
  price: {
    type: Number,
    required: [true, 'Veuillez fournir un prix.'],
    min: [0, 'Le prix ne peut pas être négatif.'],
  },
  category: {
    type: String,
    required: [true, 'Veuillez spécifier une catégorie (ex: Douleur, Énergie...).'],
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Veuillez définir la quantité en stock.'],
    min: [0, 'Le stock ne peut pas être négatif.'],
    default: 0,
  },
  imageUrl: {
    type: String,
    default: '', 
  },
  videoUrl: {
    type: String,
    default: '', // NOUVEAU : Pour stocker le lien de ta vidéo
  }
}, { 
  // Mongoose gérera automatiquement 'createdAt' et 'updatedAt'
  timestamps: true 
});

// Évite l'erreur de recompilation du modèle avec le Hot Reload de Next.js
export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
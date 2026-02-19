import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Veuillez fournir un nom."],
  },
  email: {
    type: String,
    required: [true, "Veuillez fournir une adresse email."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Veuillez fournir un mot de passe."],
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'patient'],
    default: 'patient',
  },
  image: {
    type: String, // Pour stocker l'URL du profil si besoin
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Important pour Next.js : on vérifie si le modèle existe déjà pour éviter de le recompiler
export default mongoose.models.User || mongoose.model('User', UserSchema);
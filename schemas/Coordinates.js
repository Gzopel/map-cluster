import mongoose from 'mongoose';

export const coordinatesSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true,
  },
  z: {
    type: Number,
    required: true,
  },
});

const Coordinates = mongoose.model('Coordinates', coordinatesSchema);
export default Coordinates;

import mongoose from 'mongoose';

const trafficSignSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'warning',
        'regulatory',
        'mandatory',
        'information',
        'priority',
        'temporary',
        'road_markings',
      ],
      required: true,
    },
    name: {
      en: { type: String, required: true },
      rw: { type: String, required: true },
    },
    description: {
      en: { type: String, default: '' },
      rw: { type: String, default: '' },
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isFreePreview: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const TrafficSign = mongoose.model('TrafficSign', trafficSignSchema);

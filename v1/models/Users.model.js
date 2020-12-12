const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String },
    loc: {
        type: { type: String },
        coordinates: [Number],
    },
    isBlocked: { type: Boolean, required: true, default: 0 }
}, { timestamps: true });


UserSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Users", UserSchema);
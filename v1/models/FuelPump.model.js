const { string } = require("joi");
const mongoose = require("mongoose");

const FuelPumpSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    imageUrl: { type: String },
    address: { type: String },
    fillingType:[String],
    loc: {
        type: { type: String },
        coordinates: [Number],
    },
}, { timestamps: true });



FuelPumpSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("FuelPumps", FuelPumpSchema);
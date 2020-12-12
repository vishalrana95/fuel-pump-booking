const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    fuelPumpId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    bookingDetails: [
        {
            vehicalName: { type: String, required: true },
            fuelType: { type: String, required: true },
            fuelQty: { type: Number, required: true }
        }
    ]

}, { timestamps: true });



module.exports = mongoose.model("Bookings", BookingSchema);
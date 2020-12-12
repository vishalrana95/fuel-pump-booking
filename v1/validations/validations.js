const Joi = require('joi');

const userSchema = Joi.object().keys({
    firstName: Joi.string().min(3).max(25).required(),
    lastName: Joi.string().min(3).max(25).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().min(6).max(15).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().options({ messages: { any: { allowOnly: 'password should match' } } }),
    lng: Joi.number(),
    lat: Joi.number(),
});

const fuelPumpSchema = Joi.object().keys({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    address: Joi.string().min(3).max(50).required(),
    fillingType:Joi.array().items(String).min(1).unique().required(),
    lng: Joi.number(),
    lat: Joi.number(),
});

const objectSchema = Joi.object({
    vehicalName: Joi.string().min(3).max(20).required(),
    fuelType: Joi.string().min(3).max(10).required(),
    fuelQty: Joi.number()
}).required();

const bookingSchema = Joi.object().keys({
    fuelPumpId: Joi.string().alphanum().min(3).max(50).required(),
    userId: Joi.string().alphanum().min(3).max(50).required(),
    bookingDetails: Joi.array().items(objectSchema).min(1).unique().required()
});

module.exports = {
    userSchema: userSchema,
    fuelPumpSchema: fuelPumpSchema,
    bookingSchema: bookingSchema
};
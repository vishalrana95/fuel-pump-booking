const Users = require("../models/Users.model");
const FulePumps = require("../models/FuelPump.model");
const Bookings = require("../models/Booking.model");
const service = require("../services/users.service");


exports.signUp = async (req, res) => {
    const pass = await service.encryptPassword(req.body.password); //encrypt user password to store in db
    const userData = {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
        email: req.body.email.trim(),
        phone: req.body.phone.trim(),
        password: pass,
        loc: {
            type: "Point",
            coordinates: [req.body.lng, req.body.lat]
        },
        imageUrl: req.imgUrl
    }

    Users.create(userData, (err, created) => {
        if (err) {
            sendErrorResponse(res, err.message);
        } else {
            delete userData.password;
            const authToken = service.generateToken(userData); // generate token and send back to user
            userData.authToken = authToken;
            sendSuccessResponse(res, userData);
        }
    });
};

exports.signIn = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return sendErrorResponse(res, 'Email and Password required!');
    }
    const userReq = {
        email: req.body.email.trim(),
        password: req.body.password
    }

    Users.findOne({ email: userReq.email }, async (err, user) => {
        if (err) {
            sendErrorResponse(res, err.message);
        } else {
            if (user) { //user exist in db
                const passMatch = await service.matchPassword(userReq.password, user.password)
                if (passMatch) {
                    let userRes = {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        phone: user.phone,
                        loc: user.loc,
                        imageUrl: user.imageUrl
                    }
                    const authToken = service.generateToken(userRes); // generate token and send back to user
                    userRes.authToken = authToken;

                    sendSuccessResponse(res, userRes);
                } else { // user password does not matched
                    sendErrorResponse(res, 'Invalid password!');
                }
            } else { // no user found with this email
                sendErrorResponse(res, 'No user found!');
            }
        }
    });

};

exports.createPump = (req, res) => {

    const pumpData = {
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        phone: req.body.phone.trim(),
        imageUrl: req.imgUrl,
        address: req.body.address.trim(),
        fillingType: req.body.fillingType,
        loc: {
            type: "Point",
            coordinates: [req.body.lng, req.body.lat]
        },
    }

    FulePumps.create(pumpData, (err, created) => {
        if (err) {
            sendErrorResponse(res, err.message);
        } else {
            sendSuccessResponse(res, created);
        }
    });
};

exports.getNearestPump = (req, res) => {
    if (!req.body.fuelType || !req.body.lng || !req.body.lat) {
        return sendErrorResponse(res, 'Data required!');
    }
    FulePumps.find(
        {
            fillingType: { $all: req.body.fuelType },
            "loc": {
                $near: {
                    $geometry: { type: "Point", coordinates: [req.body.lng, req.body.lat] }
                }
            }
        },
        (err, data) => {
            if (err) {
                sendErrorResponse(res, err.message);
            } else {
                sendSuccessResponse(res, data);
            }
        }
    );
};

exports.createBooking = (req, res) => {
    const bookingData = {
        fuelPumpId: req.body.fuelPumpId,
        user: req.body.userId,
        bookingDetails: req.body.bookingDetails
    }
    Bookings.create(bookingData, (err, created) => {
        if (err) {
            sendErrorResponse(res, err.message);
        } else {
            sendSuccessResponse(res, created);
        }
    });
};

exports.getBookings = (req, res) => {
    if (!req.query.fuelPumpId) {
        return sendErrorResponse(res, 'Fuel pump id required!');
    }
    Bookings.find({ fuelPumpId: req.query.fuelPumpId })
        .populate({ path: 'user', match: { 'isBlocked': false } })
        .exec((err, data) => {
            if (err) {
                sendErrorResponse(res, err.message);
            } else {
                sendSuccessResponse(res, data);
            }
        });
};

sendErrorResponse = (res, message) => {
    res.status(200).send({ success: false, message: message, data: null });
}

sendSuccessResponse = (res, data) => {
    res.status(200).send({ success: true, message: 'Successfully done!', data: data });
}
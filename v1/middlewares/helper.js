const service = require("../services/users.service");
const { validations } = require("../validations");
const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})


verifyApiKey = (req, res, next) => {
    const key = req.headers["api_key"];
    // we can also generete api key and store in db with hit counter, user send key with every request &
    //  we match the key with db, & plus one the hit counter, we can authorize the key & can set the max hits
    // according to task requirement I placed api key in.env file
    if (key === process.env.API_KEY) {
        next();
    } else {
        return res.status(403).send({
            message: `Invalid API key!`
        });
    }
}

verifyToken = async (req, res, next) => {
    const token = req.headers["token"];
    if (!token) {
        return res.status(401).send({ success: false, message: "No token provided!", data: [] });
    }
    const decodedToken = await service.verifyToken(token);
    if (!decodedToken) {
        return res.status(401).send({ success: false, message: "Invalid token!", data: [] });
    }
    req.email = decodedToken.data.email;
    next();

}

uploadFiles = (req, res, next) => {
    const upload = multer({ storage: storage, limits: { fileSize: 3 * 1024 * 1024 } }).single('file');
    upload(req, res, (err) => {
        if (req.file) {
            if (err) {
                return res.status(200).send({ success: false, message: err.message, data: [] });
            } else {
                //here we can upload file to cloud storage and get url to store in db
                req.imgUrl = req.file.path; // set file path to request object
                next()
            }
        } else {
            req.imgUrl = null; //if no file seleted by user
            next();
        }
    });
}

validateUserData = (req, res, next) => {
    const valid = validations.userSchema.validate(req.body);
    if (valid.error) {
        return res.status(200).send({ success: false, message: valid.error.details[0].message, data: null });
    }
    next();
}

validateFuelPumpData = (req, res, next) => {
    const valid = validations.fuelPumpSchema.validate(req.body);
    if (valid.error) {
        return res.status(200).send({ success: false, message: valid.error.details[0].message, data: null });
    }
    next();
}

validateBookingData = (req, res, next) => {
    const valid = validations.bookingSchema.validate(req.body);
    if (valid.error) {
        return res.status(200).send({ success: false, message: valid.error.details[0].message, data: null });
    }
    next();
}

const helper = {
    verifyApiKey: verifyApiKey,
    verifyToken: verifyToken,
    uploadFiles: uploadFiles,
    validateUserData: validateUserData,
    validateFuelPumpData: validateFuelPumpData,
    validateBookingData: validateBookingData
};

module.exports = helper;
const { helper } = require("../middlewares");
const users = require("../controllers/users.controllers.js");

module.exports = app => {

  //create new user
  app.post("/api/v1/sign_up", [helper.verifyApiKey, helper.uploadFiles, helper.validateUserData], users.signUp);

  //sign in user
  app.post("/api/v1/sign_in", [helper.verifyApiKey], users.signIn);

  //create new fuel pump
  app.post("/api/v1/create_pump", [helper.verifyApiKey, helper.uploadFiles, helper.validateFuelPumpData], users.createPump);

  //find nearest fuel pump
  app.post("/api/v1/get_nearest_pump", [helper.verifyApiKey, helper.verifyToken], users.getNearestPump);

  //create booking
  app.post("/api/v1/create_booking", [helper.verifyApiKey,helper.verifyToken, helper.validateBookingData], users.createBooking);

  //get booking by fuel pump
  app.get("/api/v1/get_bookings", [helper.verifyApiKey], users.getBookings);

};

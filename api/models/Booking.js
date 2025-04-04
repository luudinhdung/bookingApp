const mongoose = require('mongoose')
const { Schema } = mongoose;

const Booking = new Schema({
    place:Object,
    userBooking:String,
    checkIn:Date,
    checkOut:Date,
    difference : Number
});
const BookingModel = mongoose.model('Booking', Booking);
module.exports = BookingModel

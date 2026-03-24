import User from "../models/User.js";
import Booking from "../models/Booking.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.params.id,
    }).populate("event");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
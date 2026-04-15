import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

export const createBooking = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({ message: "Only users can create booking" });
    }

    const { eventId } = req.body;
    const seats = Number(req.body.seats);

    if (!Number.isInteger(seats) || seats <= 0) {
      return res.status(400).json({ message: "Seats must be a positive integer" });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.availableSeats < seats) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const totalAmount = event.price * seats;

    const booking = await Booking.create({
      user: req.user._id,
      event: eventId,
      seatsBooked: seats,
      totalAmount,
      paymentStatus: "paid",
    });

    event.availableSeats -= seats;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate(
      "event",
    );

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("event", "title date");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    const event = await Event.findById(booking.event);
    if (event) {
      event.availableSeats += booking.seatsBooked;
      await event.save();
    }

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Event from "../models/Event.js";

// ================= GET ALL USERS =================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET USER BOOKINGS =================
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

// ================= GET ALL ORGANIZER REQUESTS =================
export const getOrganizerRequests = async (req, res) => {
  try {
    const organizers = await User.find({
      role: "organizer",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(organizers);
  } catch (error) {
    console.error("GET ORGANIZER REQUESTS ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ONLY PENDING ORGANIZER REQUESTS =================
export const getPendingOrganizerRequests = async (req, res) => {
  try {
    const pendingRequests = await User.find({
      role: "organizer",
      organizerRequestStatus: "pending",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(pendingRequests);
  } catch (error) {
    console.error("GET PENDING ORGANIZER REQUESTS ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= APPROVE ORGANIZER =================
export const approveOrganizer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "organizer") {
      return res.status(400).json({
        message: "This user is not an organizer",
      });
    }

    user.organizerRequestStatus = "approved";
    user.isApprovedOrganizer = true;

    await user.save();

    return res.json({
      message: "Organizer approved successfully",
      user,
    });
  } catch (error) {
    console.error("APPROVE ORGANIZER ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= REJECT ORGANIZER =================
export const rejectOrganizer = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "organizer") {
      return res.status(400).json({
        message: "This user is not an organizer",
      });
    }

    // find organizer events
    const organizerEvents = await Event.find({ createdBy: user._id }).select(
      "_id",
    );
    const eventIds = organizerEvents.map((event) => event._id);

    // delete all bookings related to organizer events
    if (eventIds.length > 0) {
      await Booking.deleteMany({ event: { $in: eventIds } });
    }

    // delete organizer events
    await Event.deleteMany({ createdBy: user._id });

    // delete organizer user account
    await user.deleteOne();

    return res.json({
      message: "Organizer rejected and removed successfully",
    });
  } catch (error) {
    console.error("REJECT ORGANIZER ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE USER =================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin cannot be deleted",
      });
    }

    // ================= RESTORE SEATS FOR USER BOOKINGS =================
    const userBookings = await Booking.find({ user: user._id });

    for (const booking of userBookings) {
      if (booking.event) {
        await Event.findByIdAndUpdate(booking.event, {
          $inc: { availableSeats: booking.seatsBooked },
        });
      }
    }

    // delete bookings made by this user
    await Booking.deleteMany({ user: user._id });

    // ================= IF ORGANIZER, DELETE EVENTS + RELATED BOOKINGS =================
    if (user.role === "organizer") {
      const organizerEvents = await Event.find({ createdBy: user._id }).select(
        "_id",
      );

      const eventIds = organizerEvents.map((event) => event._id);

      if (eventIds.length > 0) {
        // delete all bookings related to organizer events
        await Booking.deleteMany({ event: { $in: eventIds } });
      }

      // delete organizer events
      await Event.deleteMany({ createdBy: user._id });
    }

    // ================= DELETE USER =================
    await user.deleteOne();

    res.json({
      message: "User and related data deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({
      message: error.message || "Server error",
    });
  }
};

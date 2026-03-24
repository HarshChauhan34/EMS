import User from "../models/User.js";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenueData = await Booking.aggregate([
      { $match: { bookingStatus: "confirmed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;

    res.json({
      totalUsers,
      totalEvents,
      totalBookings,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

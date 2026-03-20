import Event from "../models/Event.js";

// ================= CREATE EVENT =================

export const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, location, price, totalSeats } =
      req.body;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      location,
      price,
      totalSeats,
      availableSeats: totalSeats,

      // ✅ image
      image: req.file ? req.file.path : "",

      createdBy: req.user._id,
    });
    console.log(req.file);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET ALL =================

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");

    res.json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET BY ID =================

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE EVENT =================

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    event.title = req.body.title;
    event.description = req.body.description;
    event.category = req.body.category;
    event.date = req.body.date;
    event.location = req.body.location;
    event.price = req.body.price;
    event.totalSeats = req.body.totalSeats;

    // optional update available seats
    if (req.body.availableSeats) {
      event.availableSeats = req.body.availableSeats;
    }

    // ✅ update image if new uploaded
    if (req.file) {
      event.image = req.file.path;
    }

    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE EVENT =================

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    await event.deleteOne();

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

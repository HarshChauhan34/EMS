import Event from "../models/Event.js";
import fs from "fs";

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
      price: Number(price) || 0,
      totalSeats: Number(totalSeats) || 0,
      availableSeats: Number(totalSeats) || 0,

      // ✅ Multer (local file path)
      image: req.file ? `/uploads/${req.file.filename}` : "",

      createdBy: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL EVENTS =================
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET EVENT BY ID =================
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email",
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE EVENT =================
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const fields = [
      "title",
      "description",
      "category",
      "date",
      "location",
      "price",
      "totalSeats",
      "availableSeats",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (["price", "totalSeats", "availableSeats"].includes(field)) {
          event[field] = Number(req.body[field]);
        } else {
          event[field] = req.body[field];
        }
      }
    });

    // ✅ If new image uploaded
    if (req.file) {
      // 🔥 Delete old image from local storage
      if (event.image) {
        const oldPath = `.${event.image}`;
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      event.image = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE EVENT =================
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔥 Delete image from local storage
    if (event.image) {
      const path = `.${event.image}`;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

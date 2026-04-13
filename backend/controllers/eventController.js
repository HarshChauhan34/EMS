import Event from "../models/Event.js";
import fs from "fs";

// ================= CREATE EVENT =================
export const createEvent = async (req, res) => {
  try {
    // ✅ Only approved organizer can create event
    if (req.user.role !== "organizer" || !req.user.isApprovedOrganizer) {
      return res.status(403).json({
        message: "Only approved organizers can create events",
      });
    }

    const { title, description, category, date, location, price, totalSeats } =
      req.body;

    const totalSeatsNumber = Number(totalSeats) || 0;

    const event = await Event.create({
      title,
      description,
      category,
      date,
      location,
      price: Number(price) || 0,
      totalSeats: totalSeatsNumber,
      availableSeats: totalSeatsNumber,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      createdBy: req.user._id,
      organizerName: req.user.name,
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL EVENTS =================
export const getAllEvents = async (req, res) => {
  try {
    let events;

    // ✅ Organizer sees only own events
    if (req.user?.role === "organizer") {
      events = await Event.find({ createdBy: req.user._id }).populate(
        "createdBy",
        "name email role",
      );
    } else {
      // ✅ Admin and users can see all events
      events = await Event.find().populate("createdBy", "name email role");
    }

    res.json(events);
  } catch (error) {
    console.error("GET ALL EVENTS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET EVENT BY ID =================
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ✅ Organizer can open only own event
    if (
      req.user?.role === "organizer" &&
      event.createdBy &&
      event.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can only view your own events",
      });
    }

    res.json(event);
  } catch (error) {
    console.error("GET EVENT BY ID ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE EVENT =================
export const updateEvent = async (req, res) => {
  try {
    // ✅ Only approved organizer can update
    if (req.user.role !== "organizer" || !req.user.isApprovedOrganizer) {
      return res.status(403).json({
        message: "Only approved organizers can update events",
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // ✅ Organizer can update only own event
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can update only your own events",
      });
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

    if (req.file) {
      if (event.image) {
        const oldPath = `.${event.image}`;
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      event.image = `/uploads/${req.file.filename}`;
    }

    event.organizerName = req.user.name;

    const updatedEvent = await event.save();

    res.json(updatedEvent);
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);
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

    // ✅ Organizer can delete only own event
    // ✅ Admin can delete any event
    if (
      req.user.role === "organizer" &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You can delete only your own events",
      });
    }

    if (!["admin", "organizer"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    if (event.image) {
      const filePath = `.${event.image}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await event.deleteOne();

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
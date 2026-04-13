// ================= ADMIN ONLY =================
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Admin access only",
  });
};

// ================= ORGANIZER ONLY (APPROVED) =================
export const organizerOnly = (req, res, next) => {
  if (
    req.user &&
    req.user.role === "organizer" &&
    req.user.isApprovedOrganizer
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Only approved organizers allowed",
  });
};

// ================= ADMIN OR ORGANIZER =================
export const adminOrOrganizer = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "admin" ||
      (req.user.role === "organizer" &&
        req.user.isApprovedOrganizer))
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Access denied",
  });
};
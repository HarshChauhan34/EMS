export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem("user");
    return null;
  }
};

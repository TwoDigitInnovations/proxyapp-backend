const authRoutes = require("@routes/authRoutes");
const categoryRoutes = require("@routes/categoryRoutes");
const appointmentRoutes = require("@routes/appointmentRoutes");

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/category', categoryRoutes);
  app.use('/appointment', appointmentRoutes);
};

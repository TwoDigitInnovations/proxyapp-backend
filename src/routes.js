const authRoutes = require("@routes/authRoutes");
const categoryRoutes = require("@routes/categoryRoutes");
const appointmentRoutes = require("@routes/appointmentRoutes");
const contentRoutes = require("@routes/contentRoutes");

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/category', categoryRoutes);
  app.use('/appointment', appointmentRoutes);
  app.use('/content', contentRoutes);
};

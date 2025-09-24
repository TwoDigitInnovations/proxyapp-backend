const authRoutes = require("@routes/authRoutes");
const categoryRoutes = require("@routes/categoryRoutes");
const appointmentRoutes = require("@routes/appointmentRoutes");
const contentRoutes = require("@routes/contentRoutes");
const serviceRoutes = require("@routes/serviceRoutes");

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/category', categoryRoutes);
  app.use('/appointment', appointmentRoutes);
  app.use('/content', contentRoutes);
  app.use('/service', serviceRoutes);
};

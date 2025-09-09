const authRoutes = require("@routes/authRoutes");
const categoryRoutes = require("@routes/categoryRoutes");

module.exports = (app) => {
  app.use('/auth', authRoutes);
  app.use('/category', categoryRoutes);
};

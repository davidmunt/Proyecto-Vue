const verifyJWT = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

module.exports = (app) => {
  app.get("/user", verifyJWT([]), userController.getCurrentUser);

  app.post("/user/login", userController.userLogin);
  app.post("/user/register", userController.registerUser);
};

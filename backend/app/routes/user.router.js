const verifyJWT = require("../middleware/auth.middleware");
const userController = require("../controllers/user.controller");

module.exports = (app) => {
  app.post("/user/login", userController.userLogin);

  app.post("/user/register", userController.registerUser);

  app.get("/user", verifyJWT([]), userController.getCurrentUser);

  app.get("/admin/clientes", verifyJWT(["admin"]), userController.getAllClientes);

  app.put("/admin/clientes/:id/estado", verifyJWT(["admin"]), userController.updateClienteEstado);
};

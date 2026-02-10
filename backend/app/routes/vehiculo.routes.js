const verifyJWT = require("../middleware/auth.middleware");
const vehiculoController = require("../controllers/vehiculo.controller");

module.exports = (app) => {
  app.post("/vehiculos", verifyJWT(["cliente"]), vehiculoController.registerVehiculo);

  app.put("/vehiculos/:id", verifyJWT(["cliente"]), vehiculoController.updateVehiculo);

  app.delete("/vehiculos/:id", verifyJWT(["cliente"]), vehiculoController.deleteVehiculo);

  app.get("/vehiculos/usuario/:userId", verifyJWT(["admin", "cliente"]), vehiculoController.getVehiculosByUser);
};

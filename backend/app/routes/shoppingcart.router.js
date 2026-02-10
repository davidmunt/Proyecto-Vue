module.exports = (app) => {
  const shoppingCartController = require("../controllers/shoppingcart.controller");

  app.post("/shoppingcart/:userId/add", shoppingCartController.addArticle);

  app.post("/shoppingcart/sum/:userId/:refArticulo", shoppingCartController.sumArticle);

  app.post("/shoppingcart/rest/:userId/:refArticulo", shoppingCartController.restArticle);

  app.delete("/shoppingcart/:userId/:refArticulo", shoppingCartController.deleteArticle);

  app.get("/shoppingcart/:userId", shoppingCartController.getUserShoppingCart);
};

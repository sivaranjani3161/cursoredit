"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const user_controller_1 = require("./user.controller");
async function userRoutes(app) {
    app.get("/users", user_controller_1.getAllUsers);
    app.get("/users/email/:email", user_controller_1.getUserByEmail);
    app.post("/users", user_controller_1.createUser);
    app.put("/users/:id", user_controller_1.updateUser);
    app.delete("/users/:id", user_controller_1.deleteUser);
}

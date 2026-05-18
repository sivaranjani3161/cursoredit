"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = roleRoutes;
const role_controller_1 = require("./role.controller");
async function roleRoutes(app) {
    app.get("/roles", role_controller_1.getAllRoles);
    app.post("/roles", role_controller_1.createRole);
    app.put("/roles/:id", role_controller_1.updateRole);
    app.delete("/roles/:id", role_controller_1.deleteRole);
}

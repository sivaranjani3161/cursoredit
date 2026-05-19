"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = permissionRoutes;
const permission_controller_1 = require("./permission.controller");
async function permissionRoutes(app) {
    app.get("/permissions", permission_controller_1.getPermissionsByRole);
    app.get("/permissions/all", permission_controller_1.getAllPermissions);
    app.post("/permissions", permission_controller_1.upsertPermissions);
}

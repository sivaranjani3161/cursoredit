import { AppDataSource } from "./config/data-source";
import { Role } from "./entities/Role";
import { User } from "./entities/User";
import { Permission } from "./entities/Permission";
import { UserStatus } from "./entities/enums/UserStatus";

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Data Source initialized for seeding...");

    const roleRepo = AppDataSource.getRepository(Role);
    const userRepo = AppDataSource.getRepository(User);
    const permRepo = AppDataSource.getRepository(Permission);

    const rolesData = [
      { name: "Admin", code: "admin", description: "Full system access" },
      { name: "Editor", code: "editor", description: "Can edit content" },
      { name: "Viewer", code: "viewer", description: "Read-only access" },
    ];

    const roles: Role[] = [];
    for (const r of rolesData) {
      let role = await roleRepo.findOne({ where: { code: r.code } });
      if (!role) {
        role = roleRepo.create(r);
        await roleRepo.save(role);
        console.log(`Role ${r.code} created.`);
      }
      roles.push(role);
    }

    const adminRole = roles.find(r => r.code === "admin")!;

    const adminEmail = "sivaranjani.g@codingmart.com";
    let adminUser = await userRepo.findOne({ where: { email: adminEmail } });
    if (!adminUser) {
      adminUser = userRepo.create({
        email: adminEmail,
        name: "Sivaranjani G",
        roleId: adminRole.id,
        status: UserStatus.ACTIVE,
        authProvider: "google",
      });
      await userRepo.save(adminUser);
      console.log(`Admin user ${adminEmail} created.`);
    } else {
      adminUser.roleId = adminRole.id;
      await userRepo.save(adminUser);
      console.log(`Admin user ${adminEmail} updated to admin role.`);
    }

    const modules = ["courses", "blogs", "gallery", "enquiries", "testimonials"];
    const ops = ["create", "read", "update", "delete"];
    
    for (const mod of modules) {
      for (const op of ops) {
        const code = `${mod}:${op}`;
        const existing = await permRepo.findOne({ where: { code, roleId: adminRole.id } });
        if (!existing) {
          await permRepo.save(permRepo.create({
            roleId: adminRole.id,
            code,
            name: `${mod} ${op}`,
          }));
        }
      }
    }
    console.log("Admin permissions seeded.");

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seed();

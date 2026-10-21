import { env } from "../config/env.js"
import { Role } from "../generated/prisma/enums.js"
import { prisma } from "../lib/prisma.js"
import bcrypt from "bcrypt"

export const seedAdmin = async () => {
    try {
        const adminName = env.ADMIN_NAME
        const adminEmail = env.ADMIN_EMAIL
        const adminPassword = env.ADMIN_PASSWORD

        const SALT_ROUNDS = 12;


        const isAdminExist = await prisma.user.findMany({
            where: {
                role: "ADMIN"
            }
        });

        if (isAdminExist) {
            console.log("Admin already Exist.");
            return
        }

        const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);
        const admin = await prisma.user.create({
            data: {
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: Role.ADMIN,
                isActive: true,
            }
        })

        console.log("Seed Admin Created");
    } catch (error) {
        console.log("Error Seeding Admin : ", error);
    }
}
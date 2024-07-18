import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10)

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })
      res.status(201).json({ message: "User created successfully" })
    } catch (error) {
      res.status(400).json({ message: "User creation failed" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
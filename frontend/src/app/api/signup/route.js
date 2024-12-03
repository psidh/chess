import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(email);
    console.log(password);
    
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (user) {
      return NextResponse.json(
        { error: "User already exists please login" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    await prisma.$disconnect();

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      newUser,
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

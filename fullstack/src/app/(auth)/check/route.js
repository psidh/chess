import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const userID = await getDataFromToken(request);
    const user = await prisma.user.findUnique({
      where: {
        userId: userID,
      },
    });
    return NextResponse.json({ email: user.email, status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}

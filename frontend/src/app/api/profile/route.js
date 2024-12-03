import { NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const userID = await getDataFromToken(request);

    const user = await prisma.user.findUnique({
      where: { userId: userID },
      include: {
        asPlayer1: {
          include: {
            player2: true, // Opponent details
          },
          orderBy: { startedAt: "desc" },
          take: 5,
        },
        asPlayer2: {
          include: {
            player1: true, // Opponent details
          },
          orderBy: { startedAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", status: 404 },
        { status: 404 }
      );
    }

    const totalGames = user.asPlayer1.length + user.asPlayer2.length;
    const wins =
      user.asPlayer1.filter((game) => game.winner === user.email).length +
      user.asPlayer2.filter((game) => game.winner === user.email).length;
    const losses = totalGames - wins;

    const recentGames = [
      ...user.asPlayer1.map((game) => ({
        opponent: game.player2.email,
        result: game.winner === user.email ? "Win" : "Loss",
        startedAt: game.startedAt,
        endedAt: game.endedAt,
      })),
      ...user.asPlayer2.map((game) => ({
        opponent: game.player1.email,
        result: game.winner === user.email ? "Win" : "Loss",
        startedAt: game.startedAt,
        endedAt: game.endedAt,
      })),
    ].slice(0, 5);

    await prisma.$disconnect();
    
    return NextResponse.json(
      {
        user: {
          email: user.email,
          rating: user.rating,
          createdAt: user.createdAt,
          totalGames,
          wins,
          losses,
          recentGames,
        },
        status: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

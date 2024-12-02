import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "https://chess-iota-eight.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.post("/api/auth/user", async (req, res): Promise<any> => {
  try {
    const { email } = req.body;
    console.log("email: " + email);

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    let newUser;
    if (user) {
      console.log(user);

      return res
        .status(201)
        .json({ message: "Logged In Successfully", status: 201 });
    } else {
      newUser = await prisma.user.create({
        data: {
          email: email,
          createdAt: new Date(),
        },
      });
      console.log(newUser);

      return res
        .status(201)
        .json({ message: "Created Account Successfully", user: newUser });
    }
  } catch (error: any) {
    console.log("Error: " + error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});


app.post("/api/profile", async (req, res): Promise<any> => {
  try {
    const { email } = await req.body;

    const user = await prisma.user.findFirst({
      where: { email: email },
      include: {
        asPlayer1: {
          include: { player2: true },
          orderBy: { startedAt: "desc" },
          take: 5, // Limit recent games
        },
        asPlayer2: {
          include: { player1: true },
          orderBy: { startedAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return res.json({ message: "User not found", status: 404 });
    }

    const totalGames = user.asPlayer1.length + user.asPlayer2.length;
    const wins =
      user.asPlayer1.filter((game) => game.winner === user.email).length +
      user.asPlayer2.filter((game) => game.winner === user.email).length;
    const losses = totalGames - wins;

    return res.json({
      user: {
        email: user.email,
        rating: user.rating,
        createdAt: user.createdAt,
        totalGames,
        wins,
        losses,
        recentGames: [
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
        ].slice(0, 5),
      },
      status: 201,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3002, () => {
  console.log("Backend listening at 3002");
});

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const allowedOrigins = [
  "https://chess-iota-eight.vercel.app", // Deployed frontend
  "http://localhost:3000", // Local testing
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.options("*", (req, res) => {
  console.log("Handling preflight request for:", req.headers.origin);
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(204).end();
});

app.use((req, res, next) => {
  res.setHeader("X-Debug-Origin", req.headers.origin || "unknown");
  res.setHeader("X-Debug-Path", req.path);
  console.log(`[Request] Origin: ${req.headers.origin}, Path: ${req.path}`);
  next();
});

app.use(express.json());

app.post("/api/auth/user", async (req, res): Promise<any> => {
  try {
    const { email } = req.body;
    console.log("email:", email);

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      console.log("Existing user:", user);
      return res
        .status(201)
        .json({ message: "Logged In Successfully", status: 201 });
    } else {
      const newUser = await prisma.user.create({
        data: { email, createdAt: new Date() },
      });
      console.log("New user created:", newUser);
      return res
        .status(201)
        .json({ message: "Created Account Successfully", user: newUser });
    }
  } catch (error: any) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.post("/api/profile", async (req, res): Promise<any> => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findFirst({
      where: { email },
      include: {
        asPlayer1: {
          include: { player2: true },
          orderBy: { startedAt: "desc" },
          take: 5,
        },
        asPlayer2: {
          include: { player1: true },
          orderBy: { startedAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalGames = user.asPlayer1.length + user.asPlayer2.length;
    const wins =
      user.asPlayer1.filter((game) => game.winner === user.email).length +
      user.asPlayer2.filter((game) => game.winner === user.email).length;
    const losses = totalGames - wins;

    return res.status(200).json({
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
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Backend listening at ${PORT}`);
});

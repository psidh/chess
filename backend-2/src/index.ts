import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.use(express.json());

app.post('/api/auth/user', async (req, res): Promise<any> => {
  try {
    const { email } = req.body;
    console.log('email: ' + email);

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
        .json({ message: 'Logged In Successfully', status: 201 });
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
        .json({ message: 'Created Account Successfully', user: newUser });
    }
  } catch (error: any) {
    console.log('Error: ' + error);
    return res
      .status(500)
      .json({ message: 'Internal server error', error: error.message });
  }
});

app.listen(3002, () => {
  console.log('Backend listening at 3002');
});

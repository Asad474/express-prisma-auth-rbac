import dotenv from 'dotenv';
import createApp from './app';
import { prisma } from './utils/prismaClient';
dotenv.config();

const app = createApp(prisma);

const port = Number(process.env.PORT) || 8000;

app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});

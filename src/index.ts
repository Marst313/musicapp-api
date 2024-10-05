import app from './app';
import dotenv from 'dotenv';
import { initializeTables } from './services/dbInitService';

dotenv.config();

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeTables();

    app.listen(port, () => {
      console.log(`Server running at http://127.0.0.1:${port}`);
    });
  } catch (error) {
    console.error('Failed to initialize database tables:', error);
    process.exit(1);
  }
}

startServer();

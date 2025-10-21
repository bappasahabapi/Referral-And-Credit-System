/* eslint-disable @typescript-eslint/no-explicit-any */
import http, { Server } from 'http';
import app from './app';
import connectDB from './app/DB';
import config from './app/config';

let server: Server;

async function main() {
  try {
   await (connectDB as any)(); // keep original connect logic

    server = app.listen(config.port, () => {
      console.log(`🚀 Server listening on port ${config.port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();


process.on('unhandledRejection', (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});

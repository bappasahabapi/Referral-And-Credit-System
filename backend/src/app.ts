/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import swaggerUi from 'swagger-ui-express';
import { apiSpec } from './app/config/swagger';

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

// mount versioned api router
app.use('/api', router);

// swagger docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSpec as any));

// not found
app.use(notFound);

// global error handler
app.use(globalErrorHandler);

export default app;

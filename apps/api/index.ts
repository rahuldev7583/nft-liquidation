import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from 'express';
import swap from './routes/swap';
import cors from 'cors';

const app = express();
const port = 5000;

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Nft Liquidation Server');
});

app.use('/swap', swap);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`Nft Liquidation Server listening on port ${port}`);
});

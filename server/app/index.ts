import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { processVotes } from './posts';
import { Routes } from './routes';

const allowCrossDomain = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
  next();
};

class App {
  public app: express.Application = express();
  public routePrv: Routes = new Routes();

  constructor() {
    this.config();
    processVotes();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    this.app.set('port', process.env.PORT || 3001);

    this.app.use(bodyParser.json());
    this.app.use(allowCrossDomain);
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(express.static('public'));
  }
}

export default new App().app;

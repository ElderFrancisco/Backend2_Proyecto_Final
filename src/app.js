import express from 'express';
import http from 'http';
import setupRoutes from './routes/index.js';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';
import utilSocket from './middlewares/socket.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import compression from 'express-compression';
import errorHandler from './middlewares/error.js';
import __dirname from './utils.js';
import { addLogger } from './middlewares/winston.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

class Server {
  constructor() {
    if (!Server.instance) {
      this.app = express();
      this.port = config.port || 3000;
      this.settings();
      this.server = http.createServer(this.app);
      this.middlewares();
      this.routes();
      Server.instance = this;
    }
    return Server.instance;
  }
  settings() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.engine('handlebars', exphbs.engine());
    this.app.set('view engine', 'handlebars');
    this.app.set('views', `${__dirname}/views`);
    this.app.use(express.static(`${__dirname}/public`));
    this.app.use(
      session({
        store: MongoStore.create({
          mongoUrl: config.mongo_url,
          dbName: config.mongo_name,
          ttl: 1100,
        }),
        secret: config.privatekey,
        resave: true,
        saveUninitialized: true,
      }),
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(cookieParser());
    this.app.use(
      compression({
        brotli: { enabled: true, zlib: {} },
      }),
    );
    const swaggerOptions = {
      definition: {
        openapi: '3.0.1',
        info: {
          title: 'Francisco Elder Ecommerce API',
          description:
            'Hola Bienvenido a la documentacion de mi api, para que puedas apreciar como funciona mi api, necesitas haber iniciado sesion, puedes ir al inicio e iniciar Sesión o hacerlo desde la secion sessions de la api. Muchas gracias por visitar mi api, cualquier duda contacta a franciscoelder0@gmail.com',
          version: '1.0.0',
        },
      },
      apis: [`${__dirname}/docs/**/*.yaml`],
    };

    const specs = swaggerJSDoc(swaggerOptions);
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  middlewares() {
    initializePassport();
    this.app.use(addLogger);
    this.app.use(errorHandler);
    utilSocket(this.server);
  }

  routes() {
    this.app.use('/', setupRoutes);
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log(`${config.baseUrl}:${this.port}`);
    });
  }
}

export default new Server();

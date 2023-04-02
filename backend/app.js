require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { errorHandler } = require('./middlewares/error-handler');
const { PORT, DB_ADDRESS, ORIGIN } = require('./config');

const app = express();
app.use(helmet());
app.use(cors({ origin: ORIGIN }));
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.set('strictQuery', true);
mongoose.connect(DB_ADDRESS);

app.listen(PORT);

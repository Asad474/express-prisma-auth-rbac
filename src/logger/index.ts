import { Logger } from 'winston';
import devLogger from './dev.logger';
import prodLogger from './prod.logger';

const logger: Logger =
  process.env.NODE_ENV !== 'production' ? devLogger() : prodLogger();

export default logger;

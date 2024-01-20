import './pre-start'; // Must be the first import
import server from './server';
import logger from 'jet-logger';
import EnvVars from '@src/constants/EnvVars';
import createDBConnection from './util/create-connection';

// **** Start server **** //
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
try {
  createDBConnection()
    .then(() => {
      const msg = 'Express server started on port: ' + EnvVars.Port;
      server.listen(EnvVars.Port, () => logger.info('Server 1 ' + msg));
    })
    .catch((err: Error) => {
      logger.info('Unable to start server: ' + err.message);
    });
} catch (err) {
  logger.info('Error, Unable to start server: ' + err);
}

import mongoose from 'mongoose';
import logger from 'jet-logger';
import { isEmpty } from '@src/util/Functions';
import EnvVars from '@src/constants/EnvVars';

const createDBConnection = async () => {
  const connectionString = EnvVars.DbConnectionString;

  if (isEmpty(connectionString)) {
    return Promise.reject('Please provide db url to connect to');
  }

  mongoose.connection.on('connected', () => {
    logger.info('Connected to database & bucket created');
  });

  mongoose.connection.on('error', err => {
    logger.info('Error: Connecting to database failed,' + err);
  });

  const connection = await mongoose.connect(connectionString, {
    maxPoolSize: 10,
    replicaSet: 'rs',
    retryWrites: true,
    readPreference: 'secondaryPreferred',
    writeConcern: { w: 'majority', j: true },
  });

  return connection;
};

export default createDBConnection;

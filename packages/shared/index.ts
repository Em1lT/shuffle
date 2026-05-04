export { env as BackendEnv } from './environment';

// import { eventSchema } from '@shuffle:shared/'
export * from './environment';
export * from './validators';

// Do not mix these imports. They should be imported from the database package
// for example: 
// import { db } from '@shuffle:shared/database'

// export * as db from './database';
// export * as schema from './database/schema';

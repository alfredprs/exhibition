import { createPool } from 'mysql2';

const connection = createPool({
    host: 'rizqisemesta.com',
    user: 'exhibition',
    password: 'bOQBCdyiFTnesxcr',
    database: 'rmc_database'
});

export default connection;
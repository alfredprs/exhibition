import { createPool } from 'mysql2';

const connectionKLHK = createPool({
    host: 'rizqisemesta.com',
    user: 'exhibition',
    password: 'bOQBCdyiFTnesxcr',
    database: 'iot_klhk'
});

export default connectionKLHK;
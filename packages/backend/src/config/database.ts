import knexInstance from 'knex';
import knexConfig from '../../knexfile';

const knex = knexInstance(knexConfig)

export default knex;

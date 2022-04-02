import knex from 'knex';
import type { Knex } from 'knex';
import knexConfig from '../../knexfile';

const knexInstance: Knex = knex(knexConfig);

export default knexInstance;

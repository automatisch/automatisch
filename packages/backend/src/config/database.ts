import { Model } from 'objection';
import knexInstance from 'knex';
import knexConfig from '../../knexfile';

const knex = knexInstance(knexConfig)
Model.knex(knex)

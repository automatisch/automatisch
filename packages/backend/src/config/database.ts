import knexInstance from 'knex';
import { Model } from 'objection';

import knexConfig from '../../knexfile';

const knex = knexInstance(knexConfig)
Model.knex(knex)

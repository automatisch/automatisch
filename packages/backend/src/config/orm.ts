import { Model } from 'objection';
import { client } from './database';

Model.knex(client);

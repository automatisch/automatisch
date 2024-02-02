import { Model } from 'objection';
import { client } from './database.js';

Model.knex(client);

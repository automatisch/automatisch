import { Model } from 'objection';
import { client } from '@/config/database.js';

Model.knex(client);

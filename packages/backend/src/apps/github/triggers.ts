import { IJSONObject } from '@automatisch/types';
import NewRepository from './triggers/new-repository';

export default class Triggers {
  newRepository: NewRepository;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.newRepository = new NewRepository(connectionData);
  }
}

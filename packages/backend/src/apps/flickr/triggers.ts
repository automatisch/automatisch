import { IJSONObject } from '@automatisch/types';
import FavoritePhoto from './triggers/favorite-photo';

export default class Triggers {
  favoritePhoto: FavoritePhoto;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.favoritePhoto = new FavoritePhoto(connectionData);
  }
}

import { IJSONObject } from '@automatisch/types';
import FavoritePhoto from './triggers/favorite-photo';
import NewPhotoInAlbum from './triggers/new-photo-in-album';

export default class Triggers {
  favoritePhoto: FavoritePhoto;
  newPhotoInAlbum: NewPhotoInAlbum;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.favoritePhoto = new FavoritePhoto(connectionData);
    this.newPhotoInAlbum = new NewPhotoInAlbum(connectionData, parameters);
  }
}

import { IJSONObject } from '@automatisch/types';
import NewFavoritePhoto from './triggers/new-favorite-photo';
import NewPhotoInAlbum from './triggers/new-photo-in-album';
import NewPhoto from './triggers/new-photo';
import NewAlbum from './triggers/new-album';

export default class Triggers {
  newFavoritePhoto: NewFavoritePhoto;
  newPhotoInAlbum: NewPhotoInAlbum;
  newPhoto: NewPhoto;
  newAlbum: NewAlbum;

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
    this.newFavoritePhoto = new NewFavoritePhoto(connectionData);
    this.newPhotoInAlbum = new NewPhotoInAlbum(connectionData, parameters);
    this.newPhoto = new NewPhoto(connectionData);
    this.newAlbum = new NewAlbum(connectionData);
  }
}

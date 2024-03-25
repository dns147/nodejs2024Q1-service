export interface ArtistDto {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export interface CreateArtistDto {
  name: string;
  grammy: boolean;
}

export interface UpdateArtistDto {
  name: string;
  grammy: boolean;
}

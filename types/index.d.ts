type Route = {
  path: string;
  title?: string;
  isPublic?: boolean;
  requiresDefaultPageQuery?: boolean;
};

type Routes = {
  [key: string]: Route;
};

type EpisodeResponse = {
  id: number;
  name: string;
  slug: string;
  link_watch: string;
  link_download: string;
}

type ServerResponse = {
  server_name: string;
  server_data: EpisodeResponse[];
}

type Movie = {
  id: number;
  title?: string;
  original_title?: string;
  name?: string;
  src?: string;
  poster?: string;
  thumbnail?: string;
  produce_by?: string,
  tmdb_id?: number,
  time?: string,
  lang?: string,
  type?: string,
  season?: number,
  vote_average?: number,
  year?: number,
  esp_total?: number,
  esp_current?: string,
  slug?: string;
  alt?: string;
  imdb?: string;
  model?: string;
  releaseYear?: number;
  totalEpisodes?: number;
  genres?: string[];
  description?: string;
  episodes: ServerResponse[];
};

type MovieTmdb = {
  id: number;
  title: string;
  original_title: string;
  poster_path: string;
  release_date: string;
  overview: string;
};

type Profile = {
  id: number,
  user_id: number,
  name: string,
  birthday: datetime,
  gender: number,
  phone: number,
  avatar: string,
  password: string,
  favorites: Movie[]
}

type ProfileReponse = {
  data: {
    data: Profile[],
  }
}

type ProfileDetailReponse = {
  code: number,
  message: string,
  data: Profile,
}

type GenresReponse = {
  id: number,
  title: string,
  slug: string,
  description: string,
}

type GenresListResponse = {
  code: number,
  message: string,
  data: GenresReponse[],
}

type LanguageReponse = {
  id: number,
  title: string,
  slug: string,
  description: string,
}

type LanguageListResponse = {
  code: number,
  message: string,
  data: LanguageReponse[],
}

type UserData = {
  id: number,
  email: string,
  permisson: number,
  is_active: number,
}

type LoginResponse = {
  data: UserData,
  token: string
}

type MovieTmdbResponse = {
  page: number,
  results: Movie[],
  total_pages: number,
  total_results: number
}

type Paginate = {
  totalItems: number,
  currentPage: number,
  totalPages: number,
  totalItemsPerPage: number
}

type MovieResponse = {
  code: number,
  message: string,
  data: Movie[],
  paginate: Paginate,
}

type MovieDetailResponse = {
  code: number,
  message: string,
  data: Movie,
}

type CastTmdb = {
  name: string;
  original_name: string;
  profile_path: string;
  character: string;
};

type CreditsTmdbResponse = {
  id: number;
  cast: CastTmdb[]
}

type ImageTmdb = {
  aspect_ratio: float,
  height: number,
  iso_639_1: string,
  file_path: string,
  vote_average: number,
  vote_count: number,
  width: number
}

type ImageTmdbResponse = {
  id: number,
  backdrops: ImageTmdb[],
  logos: ImageTmdb[],
  posters: ImageTmdb[],
}

type CommentResponse = {
  id: number,
  content: string,
  parent: CommentResponse,
  user: Profile,
  status: number,
  created_at: string,
  replies: CommentResponse[],
}

type CommentListResponse = {
  code: number,
  message: string,
  data: CommentResponse[],
}

type NotificationItem = {
  id: number,
  type: number,
  title: string,
  message: string,
  link?: string,
  time: string
};

type NotificationResponse = {
  code: number,
  message: string,
  data: NotificationItem[],
}

type WatchHistory = {
  id: number,
  profile: Profile,
  movie: Movie,
  timeProcess: number,
  episode: number,
  lastWatchedAt: string
}

type WatchHistoryDetailResponse = {
  code: number,
  message: string,
  data: WatchHistory,
}

type WatchHistoryResponse = {
  code: number,
  message: string,
  data: WatchHistory[],
}

type tvTMDB = {
  id: number,
  name: string,
  media_type: string
}

type tvTMDBResponse = {
  tv_results: tvTMDB[],
  movie_results: tvTMDB
}

type RoomResponse = {
  id: number,
  room_code: string,
  name: string,
  is_locked: Boolean,
  capacity: number,
  status: number,
  host: Profile,
  movie: Movie,
  created_at: Datetime,
}

type RoomListResponse = {
  code: number,
  message: string,
  data: RoomResponse[],
}

type RoomDetailResponse = {
  code: number,
  message: string,
  data: RoomResponse,
}
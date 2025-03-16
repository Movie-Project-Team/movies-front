type Route = {
  path: string;
  title?: string;
  isPublic?: boolean;
};

type Routes = {
  [key: string]: Route;
};

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
  password: string,
}

type ProfileReponse = {
  data: {
    data: Profile[],
  }
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
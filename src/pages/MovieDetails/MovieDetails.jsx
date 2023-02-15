import { useState, useEffect } from 'react';
import {
  useParams,
  useNavigate,
  useLocation,
  Link,
  Outlet,
} from 'react-router-dom';

import { fetchFilmToId } from 'shared/api/themoviedb';

import Loader from 'shared/components/Loader/Loader';

import styles from './MovieDetails.module.scss';

const MovieDetails = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const goBack = () => navigate(from);

  useEffect(() => {
    const getTrandingMovie = async () => {
      setLoading(true);

      try {
        const { data } = await fetchFilmToId(movieId);
        setMovies(data);
      } catch (error) {
        setError(error.massage);
      } finally {
        setLoading(false);
      }
    };
    getTrandingMovie(movieId);
  }, [movieId]);

  const { title, poster_path, overview, genres, vote_average, vote_count } =
    movies;

  const ganresList = genres?.map(ganre => ganre.name).join(', ');

  const userScore = () => {
    const scorePecentage = () => {
      return Math.round(vote_average * 10);
    };
    const userScorePecentage = scorePecentage();

    return (
      <p className={styles.MovieDetailsUserScore}>
        Оцінка користувачів:&ensp;
        {userScorePecentage}% ({vote_count})
      </p>
    );
  };

  const Score = userScore();

  return (
    <>
      <button className={styles.goBack} onClick={goBack}>
        Повернутись на попередню сторінку
      </button>
      {loading && <Loader />}
      {error && <p>{error.massage}</p>}
      <div className={styles.MovieDetailsContainer}>
        <div className={styles.MovieDetailsImage}>
          <img
            src={
              poster_path === undefined
                ? 'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'
                : `https://image.tmdb.org/t/p/w500${poster_path}`
            }
            alt=""
          ></img>
        </div>
        <div className={styles.MovieDetailsDescription}>
          <h2 className={styles.MovieDetailsTitle}>{title}</h2>
          {vote_average > 0 && Score}
          <p className={styles.MovieDetailsSubTitle}>Короткий опис</p>
          <p>{overview !== '' ? overview : 'Опис не вказано'}</p>
          <p className={styles.MovieDetailsSubTitle}>Жанри</p>
          <p>{ganresList !== '' ? ganresList : 'Жанри не вказано'}</p>
        </div>
      </div>
      <div className={styles.MovieDetailsInfo}>
        <p className={styles.MovieDetailsSubInfo}>Додаткова інформація:</p>
        <div className={styles.MovieDetailsTextInfo}>
          <Link state={{ from }} to={`cast`}>
            Акторський склад
          </Link>
          <Link state={{ from }} to={`reviews`}>
            Відгуки
          </Link>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MovieDetails;

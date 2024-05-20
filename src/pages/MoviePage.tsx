import { useParams } from "react-router-dom";
import "./moviePage.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { Movie, Rating } from "../types/movieType";

export default function MoviePage() {
  const params = useParams();
  const [movie, setmovie] = useState<Movie>();

  useEffect(() => {
    axios
      .get("https://www.omdbapi.com", {
        params: {
          apikey: "69b9849a",
          i: params.movieID,
          plot: "full",
        },
      })
      .then((response) => {
        setmovie(response.data);
      });
  }, []);

  return (
    <div className="cont">
      <div className="movie">
        <div className="img-cont">
          <img src={movie?.Poster} alt={movie?.Title} />
        </div>
        <div className="desc">
          <div className="title">{movie?.Title}</div>
          <div className="genre-duration">
            <div>{movie?.Genre} </div>
            <div>|</div>
            <div>{movie?.Runtime}</div>
          </div>
          <div className="plot">{movie?.Plot}</div>
          <div className="director-cast">
            <div>
              <b>Director:</b> {movie?.Director}
            </div>
            <div>
              <b>Cast: </b>
              {movie?.Actors}
            </div>
          </div>
          <div className="ratings">
            {movie?.Ratings.map((rating: Rating) => (
              <div>
                <b>{rating.Source}: </b>
                {rating.Value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

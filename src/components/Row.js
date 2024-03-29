import axios from '../lib/axios'
import React, { useEffect, useState } from 'react'
import '../style/Row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base__url = "https://image.tmdb.org/t/p/original/"

const Row = ({title, fetchUrl, isLargeRow}) => {
    const [movies, setmovies] = useState([])
    const [Trailermovie, setTrailermovie] = useState('')

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
      };

    const hendelClick = (movie) =>{
        if(Trailermovie){
            setTrailermovie("")
        }else{
            movieTrailer(movie?.name || movie?.original_name || movie?.title || '')
            .then((url)=>{
                // https://www.youtube.com/watch?v=b867xRQkjVA
                const urlParams = new URLSearchParams(new URL(url).search)
                setTrailermovie(urlParams.get("v"));
            })
            .catch((err)=> alert("Something is wrong this movie, try another movie"));
        }
    }

    useEffect(() => {
        async function fetchData(){
            const request = await axios.get(fetchUrl);
            setmovies(request.data.results);
            return request;
        }
        fetchData()

    }, [fetchUrl])
    return (
  
        <>
        {
            movies &&
            <div className="row__posters__group">
                <h1>{title}</h1>
                
                    <div className={`row__posters`}>
                        {
                            movies?.map((movie)=> {
                                return(
                                    <img 
                                    key={movie.id}
                                    onClick={()=> hendelClick(movie)}
                                    loading="lazy"
                                    className={`row__poster ${ isLargeRow && "row_posterLarge" }`} src={`${base__url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} title={movie.name}/>
                            
                                )
                            })
                        }
                    </div>

                    
                    {Trailermovie && 
                        <div className='Trailermovie_fixed' title='close' onClick={()=>setTrailermovie("")}>
                            <YouTube videoId={Trailermovie} opts={opts} />
                        </div>
                    }
            </div>
        }
           
        </>
    )
}

export default Row;

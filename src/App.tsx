import React, { Component } from 'react';
import axios from "axios";
import Balloon from "./imgs/balloon.svg"
import Add from "./imgs/add.png"
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon  from '@material-ui/icons/Search';
import { 
  AppBar,
  Card,
  CardContent,
  CardMedia,
  Grid,
  InputBase,
  Toolbar,
  Typography,
  CardHeader,
  IconButton,
} from '@material-ui/core';
import './App.css';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ifStatement } from '@babel/types';

const heliumApi = 'https://heliumint.azurewebsites.net/api/';
const cors = 'https://cors-anywhere.herokuapp.com/';

type Movie = {
  movieId: string,
  type: string, 
  title: string,
  textSearch: string, 
  year: string, 
  runtime: number,
  genres: string[], 
  roles: string[],
}

type Genre = {
  id: string,
  name: string,
}

type Actor = {
  id: string,
  name: string,
}

interface IState {
  movies: Movie[];
  genres: Genre[];
  actors: Actor[];
}

class App extends React.Component {
  state: IState = { 
    movies: [],
    genres: [],
    actors: [],
  };

  joinStr(list: string[]): string {
    if (list) {
      return list.join(', ')
    }
    return ''
  }

  componentDidMount() {

    // grab genre data from api
    axios.get(cors + heliumApi + 'genres').then(response => {
      const genreData: Genre[] = response.data
      this.setState({
        genres: genreData
      })
    })

    // grab movie data from api
    axios.get(cors + heliumApi + 'movies').then(response => {
      const moviesData: Movie[] = response.data
      this.setState({
        movies: moviesData
      })
    })

    // grab actor data from api
    axios.get(cors + heliumApi + 'actors').then(response => {
      const actorsData: Actor[] = response.data
      this.setState({
        actors: actorsData
      })
    })

    .catch(error => {
      console.log(error);
    });
  }

  cardClick() {
    console.log(" card clicked")
  }

  addBtnClick(e: any) {

    e.preventDefault();

    const newMovie = {
      genres: [],
      id: "12345",
      movieId: "54312",
      roles: [],
      runtime: 120,
      textSearch: "test movie",
      title: "test movie",
      type: "Movie",
      year: 1994,
    }

    // submits post request of new sample movie to axios
    axios.post(cors + heliumApi + 'movies', newMovie)
      .then(response => console.log(response.data))
      .catch(error => {console.log(error.response)})
  }

  render() {

    return (
      <React.Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <img src={Balloon} width="60" height="60" />
          <Typography variant="h6" color="inherit" noWrap>
            Helium UI
          </Typography>
          <img src={Add} onClick={this.addBtnClick} />
        </Toolbar>
      </AppBar>
      <main>
      <Grid container spacing={8}>           
          {this.state.movies.map((item, i) => (
            <Grid item key={i} sm={6} md={4} lg={3}>
              <Card className={item.title} onClick={this.cardClick}>
                <CardHeader 
                  title = {item.title}
                  action = {
                    <IconButton>
                      <MoreVertIcon/>
                    </IconButton>
                  }
                />
                <CardContent>
                  <Typography>
                    Year: {item.year}<br />
                    Runtime: {item.runtime}min <br />
                    Genres: {this.joinStr(item.genres)}<br />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </main>
      <footer>
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Fill me in later
        </Typography>
      </footer>
      </React.Fragment>
    );
  }
}

export default App;

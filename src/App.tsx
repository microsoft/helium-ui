import React, { Component } from 'react';
import axios from "axios";
import { 
  AppBar,
  Card,
  CardContent,
  CardMedia,
  ExpansionPanel, 
  ExpansionPanelSummary, 
  ExpansionPanelDetails, 
  Grid,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CameraIcon  from '@material-ui/icons/PhotoCamera';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
const heliumApi = 'https://heliumint.azurewebsites.net/api/';
const cors = 'https://cors-anywhere.herokuapp.com/';

const divStyle = {
  color: 'blue',
  backgroundColor: 'blue',
};

const cardStyle = {
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}

class App extends React.Component {
  state = {
    genres: [{ 
      id: null, 
      name: null
    }],
    movies: [{
      movieId: null,
      type: null, 
      title: null, 
      year: null, 
      runtime: null,
      genres: [], 
      roles: [],
    }],
    actors: [{
      id: null, 
      name: null
    }],
  }

  joinStr(list: string[]): string {
    if (list) {
      return list.join(', ')
    }
    return ''
  }

  componentDidMount() {

    // grab genre data from api
    axios.get(cors + heliumApi + 'genres').then(response => {
      const genreData = response.data.map((item: any) => ({
        id: item.id,
        name: item.genre
      }))
      this.setState({
        genres: genreData
      })
    })

    // grab movie data from api
    axios.get(cors + heliumApi + 'movies').then(response => {
      const moviesData = response.data.map((item: any) => ({
        movieId: item.movieId,
        type: item.type,
        title: item.title,
        year: item.year,
        runtime: item.runtime,
        genres: item.genres,
        roles: item.roles
      }))
      this.setState({
        movies: moviesData
      })
    })

    // grab actor data from api
    axios.get(cors + heliumApi + 'actors').then(response => {
      const actorsData = response.data.map((item: any) => ({
        id: item.id,
        name: item.name
      }))
      this.setState({
        actors: actorsData
      })
    })

    .catch(error => {
      console.log(error);
    });
  }

  render() {
    return (
      <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <CameraIcon />
          <Typography variant="h6" color="inherit" noWrap>
            Helium UI
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
      <Grid container spacing={8}>           
          {this.state.movies.map(item => (
            <Grid item sm={6} md={4} lg={3}>
            <Card>
              <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.title}
                  </Typography>
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

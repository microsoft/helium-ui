import React, { Component } from 'react';
import axios from "axios";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import './App.css';

const heliumApi = 'https://heliumint.azurewebsites.net/api/';
const cors = 'https://cors-anywhere.herokuapp.com/';

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
      <div>
        <h3>Movies</h3>
        <div>
         {
            this.state.movies.map((item) => { return (
              <ExpansionPanel>
                <ExpansionPanelSummary>{item.title}</ExpansionPanelSummary>
                <ExpansionPanelDetails>{"Movie ID: " + item.movieId}</ExpansionPanelDetails>
                <ExpansionPanelDetails>{"Year: " + item.year}</ExpansionPanelDetails>
                <ExpansionPanelDetails>{"Runtime: " + item.runtime}</ExpansionPanelDetails>
                <ExpansionPanelDetails>{"Genres: " + item.genres}</ExpansionPanelDetails>  
              </ExpansionPanel>
            )})
         }
        </div>
      </div>
    );
  }
}

export default App;

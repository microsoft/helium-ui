import React, { Component } from 'react';
import axios from "axios";
import Balloon from "./imgs/balloon.svg";
import MoviePH from "./imgs/movieplaceholder.jpg";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon  from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
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
  MenuItem,
  Menu,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Fab,
  CardActions,
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
  anchorEl: any,
  formsDialog: any,
  checkBoxDisplay: boolean,
  checkBox: boolean,
}

class App extends React.Component {
  state: IState = { 
    movies: [],
    genres: [],
    actors: [],
    anchorEl: '',
    formsDialog: false,
    checkBoxDisplay: false,
    checkBox: false,
  };

  joinStr(list: string[]): string {
    if (list) {
     //  return list.join(', ')
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

  // when add icon is clicked, new forms dialog opens
  formsOpen = (event:any) => {
    this.setState({ formsDialog: true });
  };

  // close form dialog
  formsClose = (event: any) => {
    this.setState({ formsDialog: false });
  }

  formsChange = (event: any) => {
    console.log(event.target.name  + " changed")
  }

  // submit forms 
  formsSubmit(event: any) {
    event.preventDefault();

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

    alert("new movie added!")
    // submits post request of new sample movie to axios
    axios.post(cors + heliumApi + 'movies', newMovie)
    .then(response => console.log(response.data))
    .catch(error => {console.log(error.response)})
  }

  deleteMovie = () => {
    console.log("delete movie")

    // event.preventDefault();
    // perform delete request of new sample movie to axios

    // axios.delete(cors + heliumApi + 'movies', {newMovie})
    //   .then(response => {
    //     console.log(response.data);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   })

  }

  deleteMultipleMovie() {
    console.log("delete movie")
    this.setState({radioDisplay: true});
  }


  // menu item on cards
  handleClick = (event:any) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  // menu item on cards
  handleClose = () => {
    console.log("handle close")
    this.setState({ anchorEl: null });
  }

  checkBoxToggle = () => {
    this.setState({checkBox: !this.state.checkBox})
  }

  render() { 
    const { anchorEl } = this.state;

    return (
      <React.Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <img src={Balloon} width="50" height="50" />
          <Typography variant="h6" color="inherit" noWrap>
            Helium UI
          </Typography>          
          <div className="searchBar">
              <SearchIcon />
              <InputBase
                placeholder="Search…"
              />
          </div>
        </Toolbar>
      </AppBar>
      <Dialog
            open={this.state.formsDialog}
            onClose={this.formsClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Add New Movie</DialogTitle>
            <DialogContent>
              <DialogContentText>Add new movie to list of movies</DialogContentText> 
              <TextField 
                autoFocus
                margin="dense"
                name="genres"
                label="Genres"
                fullWidth
                onChange={this.formsChange}
              />
              <TextField 
                name="id"
                label="ID"
                fullWidth
                onChange={this.formsChange}
              />
              <TextField 
                name="movieId"
                label="Movie ID"
                fullWidth
                onChange={this.formsChange}
              />
              <TextField 
                name="roles"
                label="Roles"
                fullWidth
                onChange={this.formsChange}
              />
              <TextField 
                name="runtime"
                label="RunTime"
                fullWidth
                onChange={this.formsChange}
              />
              <TextField
                name="textSearch"
                fullWidth 
                onChange={this.formsChange}
                label="Text Search"
              />  
              <TextField 
                name="title"
                fullWidth
                label="Title"
                placeholder="Test Movie"
                onChange={this.formsChange}
              />  
              <TextField 
                name="type"
                fullWidth
                label="Type"
                value="movie"
                onChange={this.formsChange}
              />  
              <TextField 
                name="year"
                fullWidth
                label="Year"
                onChange={this.formsChange}
              />              
            </DialogContent>
            <DialogActions>
              <Button onClick={this.formsClose} color="primary">Cancel</Button>
              <Button onClick={this.formsSubmit} color="primary">Submit</Button>
            </DialogActions>
          </Dialog>
      <main>
      <div className="fab"> 
        <Fab className="addFAB" aria-label="addMovie" onClick={this.formsOpen} color="primary" >
          <AddIcon />
        </Fab>

        <Fab aria-label="deleteMultipleMovie" color="secondary" onClick={this.checkBoxToggle} className="deleteFAB">
          <DeleteIcon/>
        </Fab>
      </div>
      <Grid container spacing={8}>           
          {this.state.movies.map((item, i) => (
            <Grid item key={i} sm={6} md={4} lg={3}>
              <Card className={item.title}>
                <CardHeader 
                  title = {item.title}
                  action = {
                    <IconButton 
                      onClick={this.handleClick}
                      aria-owns={anchorEl ? 'cardMenu' : undefined}
                      aria-haspopup="true"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                />
                <CardMedia
                  style={{height: 0, paddingTop: '56.25%'}}
                  // image="https://storage.googleapis.com/bit-docs/bit-logo%402x.png"
                  image={MoviePH}

                  title="img"
                />
                <CardContent>
                  <Typography>
                    Year: {item.year}<br />
                    Runtime: {item.runtime}min <br />
                    Genres: {this.joinStr(item.genres)}<br />
                  </Typography>
                </CardContent>
                <CardActions>
                  <Checkbox 
                    checked={this.state.checkBox}/>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Menu
          id="cardMenu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}  
        >
        <MenuItem onClick={this.deleteMovie}>Delete</MenuItem>
      </Menu>      
      </main>
      <footer>
        <Typography variant="h6" align="center" gutterBottom>
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
        </Typography>
      </footer>
      </React.Fragment>
    );
  }
}

export default App;

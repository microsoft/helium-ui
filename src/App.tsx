import React from 'react';
import axios from "axios";
import AddIcon from '@material-ui/icons/Add';
import Clear from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import { 
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fab,
  DialogContentText,
  Chip,
  InputLabel,
  MenuItem,
  Select,
  Input,
} from '@material-ui/core';
import './App.css';
import { Formik, Field, Form, FormikProps, FormikActions } from 'formik';
import { TextField } from 'formik-material-ui';
import Snackbar from '@material-ui/core/Snackbar';
import ApplicationBar from './components/applicationBar';
import MovieCard from './components/movieComp';
import { Movie, Actor, Genre } from './models/models';
import * as Yup from 'yup';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';
import { whileStatement } from '@babel/types';

const heliumApi = 'https://heliumint.azurewebsites.net/api/';
const cors = 'https://cors-anywhere.herokuapp.com/';

const genreOptions = [ "History", "Horror", "Documentary", "Sport", "Family", "Thriller", "Music", "Sci-fi", "Musical", "Mystery", "Drama",
"Biography", "Animation", "Action", "War", "Fantasy", "Adventure", "Comedy", "Crime", "Romance"];

const styles = createStyles({
  chip: {
    margin: 10,
  },
  chips: {
  },
  selected: {},
})

interface IState {
  movies: Movie[];
  actors: Actor[];
  genres: Genre[];
  anchorEl: HTMLElement | null;
  openForms: boolean,
  deleteDialog: boolean,
  postSuccessAlert: boolean,
  postFailureAlert: boolean,
  deleteAlert: boolean,
  requiredField: boolean,
  snackBarMessage: string,
  formsTitle: string,  
  deleteMovies: string[];
  deleteId: string,
  formsMovie: Movie,
  movieRoles: string[],
  movieGenres: string[],
  textSearch: string,
  genreSelect: string[],
  expandList: boolean,
}

interface IProps {
  editMovie?: Movie;
}

export type AllProps = IProps & WithStyles<typeof styles>;

class App extends React.Component<AllProps> {
  
  state: IState = {
    movies: [],
    genres: [],
    actors: [],
    anchorEl: null,
    openForms: false,
    deleteDialog: false,
    postSuccessAlert: false,
    postFailureAlert: false,
    deleteAlert: false,
    requiredField: false,
    snackBarMessage: '',
    formsTitle: '',
    deleteMovies: [],
    deleteId: '',
    formsMovie: {id: '', year: '', runtime: 0, type: 'Movie', title: '', textSearch: '', roles: [], movieId: '', genres: [], key: '0',},
    movieRoles: [],
    movieGenres: [],
    textSearch: '',
    genreSelect: [],
    expandList: false,
  };

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

  // handle input of search bar
  searchToggle = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = event.target.value.toLowerCase();
    this.setState({textSearch: val})
  }

  // snackbar notification for successful delete of movie"
  deleteMovieConfirm = (id: string, title: string) => {
    this.setState({snackBarMessage: "Deleting... " + title})
    this.setState({
      deleteDialog: true, 
      formsTitle: "Delete Movie",
      deleteId: id,
    });
  }

  // deletes a movie on dialog button "confirm"
  deleteMovie = (id: string) => {
     this.setState({deleteDialog: false, deleteAlert:true})
     let dMovies = this.state.deleteMovies;

     if(dMovies.length > 0) {
      let i: number, temp: any;
      for(i = 0; i < dMovies.length; i ++ ) {
        console.log(dMovies[i]);
        axios.delete(cors + heliumApi + 'movies/' + dMovies[i])
        .then((response: any) => { console.log(response.data);})
        .catch(error => { console.log(error); })
      }
      temp = this.state.movies.filter(function(item) {
        return !dMovies.includes(item.movieId);
      })
      this.setState({movies: temp});
      this.setState({snackBarMessage: "Deleting... " + this.state.deleteMovies})

    } else {
        axios.delete(cors + heliumApi + 'movies/' + id)
        .then((response: any) => { console.log(response.data);})
        .catch(error => { console.log(error);})
        this.setState({
          movies: this.state.movies.filter(items => items.movieId !== id)
        });
     }
  }

  // edits an existing movie on menu "edit" button click
  editMovie = (movie: Movie) => {
    this.setState({formsTitle: "Edit Movie", openForms: true, movieRoles: movie.roles, movieGenres: [],})
    this.setState({formsMovie: {
      title: movie.title,
      year: movie.year,
      runtime: movie.runtime,
      roles: '',
      genres: movie.genres,
      movieId: movie.movieId,
    }})

    //this.setState({movieGenres: movie.genres});
  }

  deleteMultipleMovies = () => {
    let moviesAr = this.state.deleteMovies;

    // snackbar notification - add movies if none selected
    if(moviesAr.length === 0) {
      this.setState({snackBarMessage:"Please select a movie (or movies) using the checkbox to delete it"}) 
      this.setState({deleteAlert: true}) 
    } else {
      this.setState({deleteDialog: true, formsTitle: "Delete Movies"})
    }
  }

  // menu item on cards
  handleMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  checkBoxToggle = (id: string, checkBox: boolean) => {
    console.log(id);
    // remove card from array of deleted movies
    if(checkBox === true) {
      this.state.deleteMovies.pop();
      console.log(this.state.deleteMovies);
    }

    // add card to array of deleted movies
    if(checkBox === false) {
      this.state.deleteMovies.push(id);
      console.log(this.state.deleteMovies);
    }
  }

  // handles edit on exisiting movie's form
  handleEdit = (subMovie: Movie) => {
    let movies = this.state.movies;
    this.setState({snackBarMessage: "Edited " + this.state.formsMovie.title + " to " + subMovie.title, openForms: false, postSuccessAlert: true});
  
    movies.push(subMovie);
    this.setState({movies})
  }

  // on forms submit button clicked
  submitMovie = (values: Movie, action:FormikActions<Movie>) => {
    let movies = this.state.movies;
    let subMovie: Movie;      
    let rolestoPush;
    let allGenres = [];
    let currentGenres = this.state.formsMovie.genres;
    let newGenres = this.state.movieGenres;

    allGenres = currentGenres.concat(newGenres);
    console.log(allGenres);    

    if(values.roles === null) {
      rolestoPush = this.state.movieRoles; }
    else { rolestoPush = values.roles }

    subMovie = {
      title: values.title,
      year: values.year,
      runtime: values.runtime,
      textSearch: values.title.toLowerCase(),
      roles: rolestoPush,
      genres: allGenres,
      movieId: values.movieId,
      id: values.movieId,
      type: 'Movie',
      key: '0',
    };

    // if editing a movie, perform axios PUT
    if(this.state.formsTitle === "Edit Movie")
    {
      axios.put(cors + heliumApi + 'movies/' + values.id, subMovie)
      .then(action => {this.handleEdit(subMovie)})
      .catch(error => {console.log(error.response)})
      this.setState({movies: this.state.movies.filter(items => items.movieId !== this.state.formsMovie.movieId )})
    }

    // if adding a new movie, performs axios post
    if(this.state.formsTitle === "Add Movie") {
      axios.post(cors + heliumApi + 'movies', subMovie)
      .then(action => this.setState({ postSuccessAlert: true, openForms: false, snackBarMessage:"Added " + values.title}))
      .catch(error => {console.log(error.response)})
      movies.push(values);
      this.setState({movies})
    }
  }

  // filters movies based on users text search 
  handleSearchFilter = (movie: Movie) => {
    let input = this.state.textSearch;

    if(this.state.textSearch === '') {
      return true;
    }
    if(movie.title.toLowerCase().includes(input)){
      return movie;
    } 
  }

  handleCurrentGenreRemove = (selected: string) => {
    console.log(selected);

    // remove selected genre from formsmovie genre list
    this.setState({formsMovie: {
      genres: this.state.formsMovie.genres.filter(genres => genres !== selected),
    }});
  
    console.log(this.state.formsMovie.genres)
  }

  handleNewGenreRemove = (selected: string) => {
    console.log(selected);
    
    // remove selected genre from moviegenre list
    this.setState({movieGenres: this.state.movieGenres.filter(genre => genre !== selected)})
    console.log(this.state.formsMovie.genres)
  }

  handleSelectGenre = (event: any) => {
    let selectedGenre = event.target.value;
    let newMovies = this.state.movieGenres;

    // add new genre to list
    newMovies.push(selectedGenre);
    this.setState(newMovies);
    console.log("movie genres" + this.state.movieGenres);
  }

  render() { 
    const { classes } = this.props;
    return (
      <React.Fragment>
      <ApplicationBar handleSearchChange={this.searchToggle}/>
      <main> 
      <Grid container spacing={8}>           
          {this.state.movies
            .sort(function(a,b) {
              if(a.title.toLowerCase() < b.title.toLowerCase()) {
                return -1 }
              if (a.title.toLowerCase() > b.title.toLowerCase()) {
                return 1 }
              return 0
            })
            .filter(this.handleSearchFilter)
            .map((item, i) => (
            <Grid item key={item.movieId} sm={6} md={4} lg={3}>
              <MovieCard toggleCheck={this.checkBoxToggle} deleteMovie={this.deleteMovieConfirm} editMovie={this.editMovie} movie={item}/>
            </Grid> ))}
        </Grid>
      </main>
      <div className="dialogs">
          <Dialog     
            open={this.state.openForms}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{this.state.formsTitle}</DialogTitle>
            <DialogContent>
              <Formik
                initialValues={this.state.formsMovie}
                validateOnChange= {true}
                validationSchema={Yup.object().shape({
                  title: Yup.string()
                  .required('Title Required'),
                  year: Yup.string()
                    .required('Year Required'),
                  runtime: Yup.string()
                    .required('Runtime Required'),
                  movieId: Yup.string()
                    .required('Required'),                                   
                })}
                onSubmit={this.submitMovie}
                render={(formikBag: FormikProps<Movie>) => (
                  <Form autoComplete="on">
                   <Field
                      required
                      name="title"
                      label="Title"
                      type="text"
                      component={TextField}
                      fullWidth
                      margin="normal" />
                    <Field 
                      requiredField
                      label="Year"
                      name="year"
                      type="text"
                      component={TextField}
                      margin="dense" />
                    <Field 
                      required
                      label="runtime"
                      name="runtime"
                      type="number"
                      component={TextField}
                      margin="dense" />
                    <Field
                      name="roles"
                      label="Roles"
                      type="text"
                      component={TextField}
                      fullWidth
                      margin="normal" />
                    <div className={classes.chips}>
                      <br/>
                      <InputLabel>Genres</InputLabel>
                      {this.state.formsMovie.genres.map(currentGenre => (
                        <Chip color="primary" label={currentGenre} onDelete={() => {this.handleCurrentGenreRemove(currentGenre)}}/>
                      ))}      
                      <br />       
                      {this.state.movieGenres.map(genre => (
                        <Chip color="secondary" label={genre} onDelete={() => {this.handleNewGenreRemove(genre)}} />
                      ))}
                    </div>         
                    <div> 
                      <br/>
                      <InputLabel>Add New Genre</InputLabel>
                      <Select
                        multiple
                        value={this.state.genreSelect}
                        onChange={this.handleSelectGenre}
                        input = {<Input />}>
                      <MenuItem><em>None</em></MenuItem>
                      {genreOptions.map(genre => (
                        <MenuItem classes={{selected: classes.selected}} key={genre} value={genre}>{genre}</MenuItem>
                      ))}
                      </Select>
                    </div>
                    <Field
                      required
                      name="movieId"
                      label="Movie ID"
                      type="text"
                      component={TextField}
                      margin="dense" />
                    <div className="formButtons">
                      <Button color="primary" onClick={() => this.setState({openForms: false})}>Cancel</Button>
                      <Button color="primary" type="submit">Submit</Button>
                    </div>
                  </Form> )}/>
          </DialogContent>
        </Dialog> 
      </div>
      <div className="deleteDialog">
        <Dialog
          open={this.state.deleteDialog} >
          <DialogTitle>{this.state.formsTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this movie?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({deleteDialog: false})} color="primary"> Cancel </Button>
            <Button onClick={() => this.deleteMovie(this.state.deleteId)} color="primary" autoFocus> Confirm </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
      <Snackbar
        className="postSuccessAlert"
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center' }}
        open={this.state.postSuccessAlert}
        message={<span id="postSuccessMessage">{this.state.snackBarMessage}</span>}
        action={[<IconButton onClick={() => this.setState({postSuccessAlert: false, openForms: false })}><CloseIcon color="primary" /></IconButton>]} />
      <Snackbar
        className="postFailureAlert"
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center' }}
        open={this.state.postFailureAlert}
        message={<span id="postFailureMessage">Failed to Add Movie</span>}
        action={[<IconButton onClick={() => this.setState({postFailureAlert: false, openForms: false })}><CloseIcon color="primary" /></IconButton>]} />
      <Snackbar
        className="deleteAlert"
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center' }}
        open={this.state.deleteAlert}
        message={<span id="deleteMessage">{this.state.snackBarMessage}</span>}
        action={[<IconButton onClick={() => this.setState({deleteAlert: false})}><CloseIcon color="primary" /></IconButton>]} />
      <Snackbar
        className="requiredField"
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center' }}
        open={this.state.requiredField}
        message={<span id="deleteMessage">Required Field</span>}
        action={[<IconButton onClick={() => this.setState({requiredField: false})}><CloseIcon color="primary" /></IconButton>]} />
      </div>
      <div className="fab"> 
        <Fab className="addFAB" aria-label="addMovie" onClick={() => this.setState({openForms: true, formsTitle:"Add Movie", movieGenres: [], formsMovie: {id: '', year: '', runtime: 0, type: 'Movie', title: '', textSearch: '', roles: [], movieId: '', genres: [], key: '0'}})} color="primary" >
          <AddIcon />
        </Fab>
        <Fab aria-label="deleteMultipleMovie" color="secondary" onClick={(this.deleteMultipleMovies)} className="deleteFAB">
          <DeleteIcon/>
        </Fab>
      </div>
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

export default withStyles(styles)(App);

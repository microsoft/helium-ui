import React from 'react';
import axios from "axios";
import AddIcon from '@material-ui/icons/Add';
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
} from '@material-ui/core';
import './App.css';
import { Formik, Field, Form, FormikProps, setNestedObjectValues, FormikActions, FormikProvider } from 'formik';
import { TextField } from 'formik-material-ui';
import Snackbar from '@material-ui/core/Snackbar';
import ApplicationBar from './components/applicationBar';
import MovieCard from './components/movieComp';
import { Movie, Actor, Genre } from './models/models';
import * as Yup from 'yup';

const heliumApi = 'https://heliumint.azurewebsites.net/api/';
const cors = 'https://cors-anywhere.herokuapp.com/';

interface IState {
  movies: Movie[];
  actors: Actor[];
  genres: Genre[];
  anchorEl: HTMLElement | null;
  formsDialog: boolean,
  deleteDialog: boolean,
  postSuccessAlert: boolean,
  postFailureAlert: boolean,
  deleteAlert: boolean,
  requiredField: boolean,
  snackBarMessage: string,
  formsTitle: string,  
  deleteMovies: string[];
  filteredMovies: [];
  deleteId: string,
  editMovieInput: Movie,
}

interface IProps {
  editMovie: Movie;
}

class App extends React.Component {
  
  state: IState = {
    movies: [],
    genres: [],
    actors: [],
    anchorEl: null,
    formsDialog: false,
    deleteDialog: false,
    postSuccessAlert: false,
    postFailureAlert: false,
    deleteAlert: false,
    requiredField: false,
    snackBarMessage: '',
    formsTitle: '',
    deleteMovies: [],
    filteredMovies: [],
    deleteId: '',
    editMovieInput: {id: '', year: '', runtime: 0, type: 'Movie', title: '', textSearch: '', roles: [], movieId: '', genres: [], key: '0',},
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

  searchToggle = (searchInput: string) => {

    //todo

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
      for(let i = 0; i < dMovies.length; i ++ ) {
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

    }
     else {
        axios.delete(cors + heliumApi + 'movies/' + id)
        .then((response: any) => { console.log(response.data);})
        .catch(error => { console.log(error);})
        this.setState({
          movies: this.state.movies.filter(items => items.movieId != id)
        });
     }
  }

  // edits an existing movie on menu "edit" button click
  editMovie = (movie: Movie) => {
    this.setState({editMovieInput: {
      title: movie.title,
      year: movie.year,
      runtime: movie.runtime,
      textSearch: movie.title.toLowerCase(),
      roles: '',
      genres: movie.genres,
      movieId: movie.movieId,
      id: movie.movieId,
      type: movie.type,
      key: '0'
    }, formsTitle: "Edit Movie", formsDialog: true})
  }

  deleteMultipleMovies = () => {
    let moviesAr = this.state.deleteMovies;

    // snackbar notification - add movies if none selected
    if(moviesAr.length === 0) {
      this.setState({snackBarMessage:"Please select a movie (or movies) using the checkbox to delete it"}) 
      this.setState({deleteAlert: true}) 
    }
    else {
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

  handleEdit = (values: Movie) => {
    let temp = this.state.editMovieInput;
    let movies = this.state.movies;
    console.log("temp " + temp.title)
    this.setState({snackBarMessage: "Edited " + this.state.editMovieInput.title + " to " + values.title, formsDialog: false, postSuccessAlert: true});
  
    movies.push(values);
    this.setState({movies});
  }

  // on forms submit button clicked
  submitMovie = (values: Movie, action:FormikActions<Movie>) => {
    
    // if editing a movie, perform axios PUT
    if(this.state.formsTitle === "Edit Movie")
    {
      axios.put(cors + heliumApi + 'movies/' + values.id, values)
      .then(action => {this.handleEdit(values)})
      .catch(error => {console.log(error.response)})
      this.setState({movies: this.state.movies.filter(items => items.movieId != this.state.editMovieInput.movieId )})

    }

    // if adding a new movie, performs axios post
    else {
      console.log(values)
      axios.post(cors + heliumApi + 'movies', values)
      .then(action => this.setState({ postSuccessAlert: true, formsDialog: false, snackBarMessage:"Added " + values.title}))
      .catch(error => {console.log(error.response)})
      this.setState({
        movies: this.state.movies.map(items => items.movieId == values.movieId)
      });
    }
  }

  render() { 
    const { anchorEl } = this.state;

    return (
      <React.Fragment>
      <ApplicationBar handleSearchChange={this.searchToggle}/>
      <main> 
      <Grid container spacing={8}>           
          {this.state.movies.map((item, i) => (
            <Grid item key={item.movieId} sm={6} md={4} lg={3}>
              <MovieCard toggleCheck={this.checkBoxToggle} deleteMovie={this.deleteMovieConfirm} editMovie={this.editMovie} movie={item}/>
            </Grid>
          ))}
        </Grid>
      </main>
      <div className="dialogs">
          <Dialog     
            open={this.state.formsDialog}
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{this.state.formsTitle}</DialogTitle>
            <DialogContent>
              <Formik
                initialValues={this.state.editMovieInput}
                validateOnChange= {true}
                validationSchema={Yup.object().shape({
                  title: Yup.string()
                  .required('Title Required'),
                  id: Yup.string()
                    .required('ID Required'),
                  year: Yup.string()
                    .required('Year Required'),
                  runtime: Yup.string()
                    .required('Runtime Required'),
                  textSearch: Yup.string()
                    .strict(true)
                    .lowercase('Value must be lowercase')
                    .required('TextSearch Required'),
                  movieId: Yup.string()
                    .required('Required'),
                  key: Yup.string() 
                    .required('Required')                                       
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
                      required
                      name="textSearch"
                      label="Text Search"
                      type="text"
                      component={TextField}
                      fullWidth
                      margin="normal" />
                    <Field
                      name="roles"
                      label="Roles"
                      type="text"
                      component={TextField}
                      fullWidth
                      margin="normal" />           
                    <Field
                      name="genres"
                      label="Genres"
                      type="text"
                      component={TextField}
                      fullWidth
                      margin="normal" />   
                    <Field
                      required
                      name="movieId"
                      label="Movie ID"
                      type="text"
                      component={TextField}
                      margin="dense" />           
                    <Field 
                      required
                      name="id"
                      label="Id"
                      type="text"
                      component={TextField}
                      margin="dense" />
                    <Field 
                      required
                      name="type"
                      label="Type"
                      type="text"
                      value="Movie"
                      component={TextField}
                      fullWidth
                      margin="normal"   
                      InputProps={{readOnly: true}} />
                    <Field 
                      required
                      name="key"
                      label="Key"
                      type="text"
                      value="0"
                      component={TextField}
                      margin="dense" />
                      <div className="formButtons">
                        <Button color="primary" onClick={() => this.setState({formsDialog: false})}>Cancel</Button>
                        <Button color="primary" type="submit">Submit</Button>
                      </div>
                  </Form>
                )}
              />
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
            <Button onClick={() => this.setState({deleteDialog: false})} color="primary">
              Cancel
            </Button>
            <Button onClick={() => this.deleteMovie(this.state.deleteId)} color="primary" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div>
      <Snackbar
        className="postSuccessAlert"
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.state.postSuccessAlert}
        message={<span id="postSuccessMessage">{this.state.snackBarMessage}</span>}
        action={[<IconButton onClick={() => this.setState({postSuccessAlert: false, formsDialog: false })}><CloseIcon color="primary" /></IconButton>]} />
      <Snackbar
        className="postFailureAlert"
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.state.postFailureAlert}
        message={<span id="postFailureMessage">Failed to Add Movie</span>}
        action={[<IconButton onClick={() => this.setState({postFailureAlert: false, formsDialog: false })}><CloseIcon color="primary" /></IconButton>]} />
      <Snackbar
        className="deleteAlert"
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.state.deleteAlert}
        message={<span id="deleteMessage">{this.state.snackBarMessage}</span>}
        action={[<IconButton onClick={() => this.setState({deleteAlert: false})}><CloseIcon color="primary" /></IconButton>]} />
      <Snackbar
        className="requiredField"
        autoHideDuration={6000}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={this.state.requiredField}
        message={<span id="deleteMessage">Required Field</span>}
        action={[<IconButton onClick={() => this.setState({requiredField: false})}><CloseIcon color="primary" /></IconButton>]} />
      </div>
      <div className="fab"> 
        <Fab className="addFAB" aria-label="addMovie" onClick={() => this.setState({formsDialog: true, formsTitle:"Add Movie" ,editMovie: {id: '', year: '', runtime: 0, type: 'Movie', title: '', textSearch: '', roles: [], movieId: '', genres: [], key: '0'}})} color="primary" >
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


export default App;

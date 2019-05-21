import React from 'react';
import axios from "axios";
import Balloon from "./imgs/balloon.svg";
import MoviePH from "./imgs/movieplaceholder.jpg";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon  from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
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
  DialogActions,
  Button,
  Fab,
  CardActions,
  DialogContentText,
} from '@material-ui/core';
import './App.css';
import { Formik, Field, Form, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import Snackbar from '@material-ui/core/Snackbar';
import { EPROTONOSUPPORT } from 'constants';


const heliumApi = 'https://heliumint.azurewebsites.net/api/';
const cors = 'https://cors-anywhere.herokuapp.com/';

type Movie = {
  id: string,
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
  deleteDialog: boolean,
  checkBoxDisplay: boolean,
  checkBox: boolean,
  postSuccessAlert: boolean,
  postFailureAlert: boolean,
  deleteAlert: boolean,
}

class App extends React.Component {
  state: IState = { 
    movies: [],
    genres: [],
    actors: [],
    anchorEl: '',
    formsDialog: false,
    deleteDialog: false,
    checkBoxDisplay: false,
    checkBox: false,
    postSuccessAlert: false,
    postFailureAlert: false,
    deleteAlert: false,
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

  deleteMovie = () => {

    console.log("delete")
    this.setState({deleteAlert: true });
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
      <div className="appbar">
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
      </div>
      <main> 
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
        <MenuItem>Edit</MenuItem>

      </Menu>      
      </main>
      <div className="dialogs">
          <Dialog     
            open={this.state.formsDialog}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">Add Movie</DialogTitle>
            <DialogContent>
              <Formik
                initialValues={{ id: '', year: '', runtime: 0, type: 'Movie', title: '', textSearch: '', roles: [], movieId: '', genres: [], }}
                onSubmit={(values:Movie , actions) => {
                  
                  // todo: add failure notification
                  // if movie params are not full then give this postfailure message
                  // this.setState({ postFailureAlert: true });

                  // submits post request of new sample movie to axios
                  axios.post(cors + heliumApi + 'movies', values)
                  .then(response => this.setState({ postSuccessAlert: true, formsDialog: false}))
                  .catch(error => {console.log(error.response)})
                  }
                }
                render={(formikBag: FormikProps<Movie>) => (
                  <Form autoComplete="on">
                    <Field
                      name="title"
                      label="Title"
                      type="text"
                      component={TextField}
                      fullWidth
                      margin="normal"
                    />
                    <Field 
                      name="year"
                      label="Year"
                      type="text"
                      component={TextField}
                      fullWidth  
                      margin="normal"
                    />
                    <Field 
                      name="runtime"
                      label="Runtime"
                      type="text"
                      component={TextField}
                      fullWidth
                      margin="normal"            
                    />
                    <Field
                      name="textSearch"
                      label="Text Search"
                      type="text"
                      component={TextField}
                      fullWidth
                      margin="normal"
                    />
                    <Field
                      name="roles"
                      label="Roles"
                      type="text"
                      component={TextField}
                      fullWidth
                      margin="normal"
                    />           
                    <Field
                      name="genres"
                      label="Genres"
                      type="text"
                      component={TextField}
                      fullWidth
                      margin="normal"
                    />   
                    <Field
                      name="movieId"
                      label="Movie ID"
                      type="text"
                      component={TextField}
                      fullWidth
                      margin="normal"
                    />           
                    <Field 
                      name="id"
                      label="Id"
                      type="text"
                      component={TextField}
                      fullWidth  
                      margin="normal"
                    />
                    <Field 
                      name="type"
                      label="Type"
                      type="text"
                      value="Movie"
                      component={TextField}
                      fullWidth
                      margin="normal"   
                      InputProps={{readOnly: true}}         
                    />
                    <Button color="primary" onClick={() => this.setState({formsDialog: false})}>Cancel</Button>
                    <Button color="primary" type="submit" >Submit</Button>
                  </Form>
                )}
              />
          </DialogContent>
        </Dialog>
      </div>
      <div className="deleteDialog">
        <Dialog
          open={this.state.deleteDialog}
          >
          <DialogTitle>Delete Movie</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this movie?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Disagree
            </Button>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>

      </div>
      <div>
      <Snackbar
        className="postSuccessAlert"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.state.postSuccessAlert}
        message={<span id="postSuccessMessage">Movie Successfully Added</span>}
        action={[<IconButton onClick={() => this.setState({postSuccessAlert: false, formsDialog: false })}><CloseIcon color="primary" /></IconButton>]}
      />
      <Snackbar
        className="postFailureAlert"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.state.postFailureAlert}
        message={<span id="postFailureMessage">Failed to Add Movie</span>}
        action={[<IconButton onClick={() => this.setState({postFailureAlert: false, formsDialog: false })}><CloseIcon color="primary" /></IconButton>]}
      />
      <Snackbar
        className="deleteAlert"
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.state.deleteAlert}
        message={<span id="deleteMessage">Movie Deleted</span>}
        action={[<IconButton onClick={() => this.setState({deleteAlert: false})}><CloseIcon color="primary" /></IconButton>]}
      />
      </div>
      <div className="fab"> 
        <Fab className="addFAB" aria-label="addMovie" onClick={() => this.setState({formsDialog: true})} color="primary" >
          <AddIcon />
        </Fab>
        <Fab aria-label="deleteMultipleMovie" color="secondary" onClick={this.checkBoxToggle} className="deleteFAB">
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

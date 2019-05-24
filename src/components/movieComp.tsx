import React, {Component} from 'react'; 
import MoviePH from "../imgs/movieplaceholder.jpg";
import PropTypes from 'prop-types';
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    CardHeader,
    Checkbox,
    IconButton,
    Menu,
    MenuItem,
    Typography,
  } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import App from '../App';
import { Movie } from '../models/models';

interface IState {
    movie: Movie;
    anchorEl: HTMLElement | null;
    formsDialog: boolean,
    deleteDialog: boolean,
    checkBoxDisplay: boolean,
    checkBox: boolean,
    postSuccessAlert: boolean,
    postFailureAlert: boolean,
    deleteAlert: boolean,
    requiredField: boolean,
  }

interface IProps {
    movie: Movie;
    deleteMovie: (id: string) => void;
    editMovie: (movie: Movie) => void;
}
  
class movieComp extends React.Component<IProps> {
    state: IState
    constructor(props:IProps) {
        super(props);
        this.state = {
            movie: props.movie,
            anchorEl: null,
            formsDialog: false,
            deleteDialog: false,
            checkBoxDisplay: false,
            checkBox: false,
            postSuccessAlert: false,
            postFailureAlert: false,
            deleteAlert: false,
            requiredField: false,
        };
    }

    handleMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    deleteMovie = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        console.log("delete " + this.state.movie.movieId);
        this.props.deleteMovie(this.state.movie.movieId);
    }

    editMovie = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        this.props.editMovie(this.state.movie);
        console.log(this.state.movie)
    }

    render() {  
        return (
            <div>
                <Card>
                <CardHeader 
                    title = {this.state.movie.title} 
                    action = {
                        <IconButton 
                          onClick={this.handleMenuClick}
                          aria-owns={this.state.anchorEl ? 'cardMenu' : undefined}
                          aria-haspopup="true" >
                          <MoreVertIcon />
                        </IconButton>
                      }
                    />
                <CardMedia
                  style={{height: 0, paddingTop: '56.25%'}}
                  image={MoviePH}
                  title="img"/>
                <CardContent>
                    <Typography>
                        Year: {this.state.movie.year}<br />
                        Runtime: {this.state.movie.runtime}min <br />
                        Genres: {this.state.movie.genres}<br />
                    </Typography>
                </CardContent>
                <CardActions>
                  <Checkbox 
                    checked={this.state.checkBox}/>
                </CardActions>
                </Card>
                <Menu
                    id="cardMenu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={() => this.setState({ anchorEl: null })} >
                    <MenuItem onClick={(this.deleteMovie)}>Delete</MenuItem>
                    <MenuItem onClick={(this.editMovie)}>Edit</MenuItem>
                </Menu>  
            </div>
        )
    }
}
export default movieComp;

import React from 'react';
import { AppBar, InputBase, Toolbar, Typography } from '@material-ui/core';
import Balloon from "../imgs/balloon.svg";
import SearchIcon  from '@material-ui/icons/Search';

interface IProps {
    handleSearchChange: (searchInput: string) => void;
}

interface IState {
    searchInput: string,
}
class applicationBar extends React.Component<IProps> {

    state: IState
    constructor(props:IProps) {
        super(props);
        this.state = {
            searchInput: '',
        };
    }

    // grab input of search bar
    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({searchInput: event.currentTarget.value});
        this.props.handleSearchChange(this.state.searchInput)
    }

    render() {  
        return (
            <div className="appbar">
                <AppBar position="static">
                    <Toolbar>
                        <img src={Balloon} width="50" height="50" />
                        <Typography variant="h6" color="inherit" noWrap>Helium UI</Typography>          
                        <div className="searchBar">
                            <SearchIcon />
                            <InputBase
                            placeholder="Search..." 
                            onChange={this.handleSearchChange} /> 
                        </div>
                    </Toolbar>
                </AppBar>          
            </div>
        )
    }
}
export default applicationBar;




import React from 'react';
import { AppBar, InputBase, Toolbar, Typography } from '@material-ui/core';
import Balloon from "../imgs/balloon.svg";
import SearchIcon  from '@material-ui/icons/Search';


class applicationBar extends React.Component {

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
                            placeholder="Search…" />
                        </div>
                    </Toolbar>
                </AppBar>          
            </div>
        )
    }
}
export default applicationBar;




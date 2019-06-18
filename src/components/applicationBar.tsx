import React from 'react';
import { AppBar, InputBase, Toolbar, Typography } from '@material-ui/core';
import Balloon from "../imgs/balloon.svg";
import SearchIcon  from '@material-ui/icons/Search';
import { createStyles, withStyles, WithStyles, fade } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';


interface IProps {
    handleSearchChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

interface IState {
    searchInput: string,
}

const styles = createStyles({
    search: {
      backgroundColor: fade('#ffffff', 0.08),
      position: 'relative',
      width: '100%',
      marginLeft: '75%',
      flexWrap: 'nowrap',
      float: "right",
      flex: 1,
    },
    toolbar: {
        flexWrap: 'wrap',
    },
})

export type AllProps = IProps & WithStyles<typeof styles>;

class applicationBar extends React.Component<AllProps> {
    state: IState
    constructor(props:AllProps) {
        super(props);
        this.state = {
            searchInput: '',
        };
    }

    render() {  
        console.log(this.props);
        const { classes } = this.props;
        return (
            <div className="appbar">
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <img src={Balloon} width="50" height="50" />
                        <Typography variant="h6" color="inherit" noWrap>Helium UI</Typography>          
                        <div className={classes.search}>
                            <SearchIcon />
                            <InputBase
                            placeholder="Search by title..." 
                            onChange={this.props.handleSearchChange} /> 
                        </div>
                    </Toolbar>
                </AppBar>          
            </div>
        )
    }
}
export default withStyles(styles)(applicationBar);




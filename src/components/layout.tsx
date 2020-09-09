// import React from 'react';
// import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import {fade, makeStyles, useTheme} from '@material-ui/core/styles';
import {InputBase} from "@material-ui/core";
import {useState} from "react";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        backgroundColor: 'white',
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    toolbarPadding: {
        // paddingLeft: 24,
        // paddingRight: 24,
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        alignItems: 'center',
        display: 'flex',
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    mainIcon: {
        width: 28,
        height: 28,
        marginRight: theme.spacing(1),
    },
    mainText: {
        marginTop: 2,
    },
    iconContainer: {
        width: 30,
        justifyContent: 'center',
        display: 'flex',
    },
    icon: {
        fontSize: 18,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

// https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/

function Layout(props) {
    const {children} = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <div className={classes.root}>
            {/*<AppBar position="fixed" className={classes.appBar} color="transparent">*/}
            {/*    <Toolbar>*/}
            {/*        <IconButton*/}
            {/*            color="inherit"*/}
            {/*            aria-label="open drawer"*/}
            {/*            edge="start"*/}
            {/*            onClick={handleDrawerToggle}*/}
            {/*            className={classes.menuButton}*/}
            {/*        >*/}
            {/*            <MenuIcon />*/}
            {/*        </IconButton>*/}

            {/*        <div className={classes.search}>*/}
            {/*            <div className={classes.searchIcon}>*/}
            {/*                <SearchIcon />*/}
            {/*            </div>*/}
            {/*            <InputBase*/}
            {/*                placeholder="Search…"*/}
            {/*                classes={{*/}
            {/*                    root: classes.inputRoot,*/}
            {/*                    input: classes.inputInput,*/}
            {/*                }}*/}
            {/*                inputProps={{ 'aria-label': 'search' }}*/}
            {/*            />*/}
            {/*        </div>*/}

            {/*        /!*<Typography variant="h6" noWrap>*!/*/}
            {/*        /!*    Responsive drawer*!/*/}
            {/*        /!*</Typography>*!/*/}
            {/*    </Toolbar>*/}
            {/*</AppBar>*/}
            <main className={classes.content}>
                {children}
            </main>
        </div>
    );
}

export default Layout

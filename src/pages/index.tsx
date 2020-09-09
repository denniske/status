import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {Paper} from "@material-ui/core";
import {useAppStyles} from "../components/app-styles";
import {withApollo} from "../../apollo/client";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

function ResponsiveDrawer(props) {
    const appClasses = useAppStyles();
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div className={classes.root}>
            <Paper className={appClasses.box}>
                <Typography variant="body1" noWrap>
                    Leaderboard
                </Typography>
                <Typography variant="subtitle2"  noWrap>
                    RM 1v1
                </Typography>
            </Paper>
        </div>
    );
}

export default withApollo(ResponsiveDrawer, {ssr:false})

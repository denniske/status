import {makeStyles} from "@material-ui/core/styles";

export const useAppStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    expanded: {
        flex: 1,
    },
    box: {
        overflow: 'hidden',
        maxWidth: 800,
        flex: 1,
        width: '100%',
        padding: theme.spacing(3),
        marginBottom: theme.spacing(3),
        // marginRight: theme.spacing(3),
    },
    boxForTable: {
        maxWidth: 800,
        marginBottom: theme.spacing(3),
        // marginRight: theme.spacing(3),
    },
}));

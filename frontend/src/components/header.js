import React from 'react'
import {withStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import {ReactComponent as Logo} from "../logo.svg";
import Button from "@material-ui/core/Button";

const useStyles = (theme) => ({
    headerBar: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        backgroundColor: theme.palette.primary.main,
        width: '100%',
        display: 'flex',
        alignItems: 'center'
    },
    projectName: {},
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    button: {
        marginLeft: 'auto'
    }
});

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
    }

    render() {
        const {classes} = this.props;
        let button;
        if (!this.state.isLoggedIn) {
            button = <Button
                type="submit"
                variant="contained"
                color="primary.dark"
                className={classes.button}
                href="/login"
            >
                Sign In
            </Button>
        } else {
            button = <h2 className={classes.button}>
                Welcome User!
            </h2>
        }

        return (
            <div className={classes.headerBar}>
                <Avatar className={classes.avatar}>
                    <Logo/>
                </Avatar>
                <h1 className={classes.projectName}>
                    Support VIZ
                </h1>
                {button}
            </div>
        )
    }
}

export default withStyles(useStyles)(Header);
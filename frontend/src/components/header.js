import React from 'react'
import axios from 'axios'
import {withStyles} from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import {ReactComponent as Logo} from "../logo.svg";
import {connect} from 'react-redux';
import Button from "@material-ui/core/Button";
import {logoutUser} from "../actions/authActions";

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
        marginLeft: 'auto',
        color: theme.palette.primary.dark
    },
    greeting: {
        marginLeft: 'auto'
    }
});

class Header extends React.Component {

    handleSignOut = (e) => {
        e.preventDefault();
        axios.get(`/api/auth/signOut`)
          .then((res) => {
              this.props.logout();
          })
          .catch((err) => {
              console.log("Error logging user out!");
          })
    };

    render() {
        const {classes} = this.props;
        let button;
        if (!this.props.isLoggedIn) {
            button = <Button
                type="submit"
                variant="contained"
                className={classes.button}
                href="/login"
            >
                Sign In
            </Button>
        } else {
            button = <div className={classes.greeting}>
                <h2>
                    Welcome {this.props.user.firstName}!
                </h2>
                <Button type="submit"
                        variant="contained"
                        className={classes.button}
                        onClick={this.handleSignOut}>
                  Sign Out
                </Button>
              </div>
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

function mapStateToProps(state) {
    return {
        isLoggedIn: state.auth.isAuthenticated,
        user: state.auth.user
    }
};

function mapDispatchToProps(dispatch) {
    return {
        logout: () => dispatch(logoutUser())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles)(Header));
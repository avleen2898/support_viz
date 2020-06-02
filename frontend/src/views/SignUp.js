import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {ReactComponent as Logo} from '../logo.svg';
import axios from "axios";
import {connect} from 'react-redux'

const useStyles = (theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/");
        }
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
        this.setState({errors: {}});
    };

    onSubmit = e => {
        e.preventDefault();
        const newUser = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };
        axios.post(`/api/users/register`, newUser, {headers: {'Accept': 'application/json'}})
            .then(res => {
                this.props.history.push("/login")
            })
            .catch(res => {
                let responseErrors = res.response.data;
                let errorsObj = {};

                Object.keys(responseErrors).forEach((key) => {
                    errorsObj[key] = responseErrors[key];
                });
                this.setState({errors: errorsObj});
            });
    };

    render() {
        const {classes} = this.props;
        const {errors} = this.state;
        return (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <Logo/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="firstName"
                                    name="firstName"
                                    variant="filled"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    onChange={this.onChange}
                                    error={!!errors.firstName}
                                    helperText={!!errors.firstName ? errors.firstName : ''}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="filled"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lastName"
                                    onChange={this.onChange}
                                    error={!!errors.lastName}
                                    helperText={!!errors.lastName ? errors.lastName : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="filled"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={this.onChange}
                                    error={!!errors.email}
                                    helperText={!!errors.email ? errors.email : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="filled"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={this.onChange}
                                    error={!!errors.password}
                                    helperText={!!errors.password ? errors.password : ''}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="filled"
                                    required
                                    fullWidth
                                    name="password2"
                                    label="Re-type Password"
                                    type="password"
                                    id="password2"
                                    onChange={this.onChange}
                                    error={!!errors.password2}
                                    helperText={!!errors.password2 ? errors.password2 : ''}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="/" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
};

export default connect(mapStateToProps)(withStyles(useStyles)(SignUp));
import React from 'react';
import Axios from 'axios';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import {withStyles} from '@material-ui/core/styles';
import {ReactComponent as Logo} from '../logo.svg';

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            errors: {}
        }
    }

    onChange = e => {
        this.setState({[e.target.id]: e.target.value});
        this.setState({errors: {}});
    };

    onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        Axios.post(`/api/users/login`, userData)
            .then(res => {
                console.log("From then: ", res);
                console.log(res.data);
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
                        Welcome!
                    </Typography>
                    <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                        <TextField
                            variant="filled"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={this.onChange}
                            error={!!errors.email}
                            helperText={!!errors.email ? errors.email : ''}
                        />
                        <TextField
                            variant="filled"
                            margin="normal"
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
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary"/>}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}>
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }
};

export default withStyles(useStyles)(SignIn);
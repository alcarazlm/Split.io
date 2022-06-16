import React from 'react';
import {
  Typography, Grid, Paper, TextField, Button
} from '@material-ui/core';
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login_email: "",
            login_password: "",
            user: undefined
        };
        this.handleLogin = this.handleLogin.bind(this);
    }
    handleLogin() {
        auth.signInWithEmailAndPassword(this.state.login_email, this.state.login_password).then((userCredential) => {
            var user = userCredential.user;
            window.location.href = `/users/${user.uid}`;
        })
        .catch((error) => {
            this.setState({login_error: error.message});
        });

    }
    


    render() {
        const paperstyle= {padding:20, height:'70vh', width:'70%', margin:"20px auto", display: "block", overflow: "auto" };
        return (
            <Grid container>
                <Paper style={paperstyle} >
                    <Grid container alignContent='center'>
                        Login
                    </Grid>
                    <TextField label='Email' placeholder='Enter Email' value={this.state.login_email}
                                onChange={(event) =>this.setState({login_email: event.target.value})} fullWidth required/>
                    <TextField label='Password' placeholder='Enter Password' value={this.state.login_password} type='password'
                                onChange={(event) => this.setState({login_password: event.target.value})} fullWidth required/>
                    <Typography>{this.state.login_error}</Typography>
                    <br/>
                    <br/>
                    <Grid item>
                        <Button onClick={() => {
                            this.handleLogin();
                            }} fullWidth>Log In</Button> 
                    </Grid>
                    <Typography>Don&apos;t have an account?</Typography>
                    <Link to='/register' >
                        <Typography>
                            Sign up!
                        </Typography>
                    
                    </Link>
                </Paper>
            </Grid>
        );}
}
export default Login;
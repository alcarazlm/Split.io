import React from 'react';
import {
  Typography, Grid, Paper, TextField, Button
} from '@material-ui/core';
import axios from 'axios';
// import { response } from 'express';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login_name: "",
            first_name: "", 
            last_name: "", 
            venmo: "", 
            login_password: "",
            password: "",
            password2: "",
        };
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);

    }
    handleLogin() {
        axios.post('/admin/login', {login_name: this.state.login_name, password: this.state.login_password})
        .then(response => {
            let user = response.data;
            this.props.isLoggedIn(user);
            this.props.handleChange("Details of ", `${user.first_name} ${user.last_name}`);
            window.location.href = `#/users/${user._id}`;
        }).catch(err => {
            this.setState({login_error: err.response.data});});

    }
    handleRegister() {
        if (this.state.password !== this.state.password2) {
            this.setState({register_error: 'Passwords do not match!'});
            return;
        }
        axios.post('user/', {login_name: this.state.register_name,
        password: this.state.password,
        password2: this.state.password2,
        first_name: this.state.first_name,
        last_name : this.state.last_name,
        venmo: this.state.venmo})
        .then(response => {
            let user = response.data;
            this.props.isLoggedIn(user);
            this.props.handleChange("Details of ", `${user.first_name} ${user.last_name}`);
            window.location.href = `#/users/${user._id}`;
        }).catch(err => {this.setState({register_error: err.response.data});});
    }
    


    render() {
        const paperstyle= {padding:20, height:'80vh', width:'50%', margin:"50px auto", display: "block", overflow: "auto" };
        // console.log("shit");
        return (
            <Grid container>
                <Paper elevation={10} style={paperstyle}>
                    <Grid container alignContent='center'>
                        Login
                    </Grid>
                    <TextField label='Username' placeholder='Enter Username' value={this.state.login_name}
                                onChange={(event) =>this.setState({login_name: event.target.value})} fullWidth required/>
                    <TextField label='Password' placeholder='Enter Password' value={this.state.login_password} type='password'
                                onChange={(event) => this.setState({login_password: event.target.value})} fullWidth required/>
                    <Typography>{this.state.login_error}</Typography>
                    <Button style={{marginTop:"40px"}} onClick={() => {this.handleLogin();}} fullWidth>Log In</Button>
                    <Grid container alignContent='center'>
                        <Typography align='center'>
                            Don&apos;t have an account?
                            <br/>
                            Register Below
                        </Typography>
                    </Grid>
               
                </Paper>
            </Grid>
        );}
}
export default LoginRegister;
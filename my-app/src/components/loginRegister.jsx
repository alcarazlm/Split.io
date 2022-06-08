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
                    <TextField label='First Name' placeholder='Enter Your First Name' value={this.state.first_name}
                                onChange={(event) =>this.setState({first_name: event.target.value})} fullWidth required/>
                    <TextField label='Last Name' placeholder='Enter Your Last Name' value={this.state.last_name}
                                onChange={(event) => this.setState({last_name: event.target.value})} fullWidth required/>
                    <TextField label='Username' placeholder='Enter Username' value={this.state.register_name}
                                onChange={(event) =>this.setState({register_name: event.target.value})} fullWidth required/>
                    <TextField label='Password' placeholder='Enter Password' value={this.state.password} type='password'
                                onChange={(event) => this.setState({password: event.target.value})} fullWidth required/>
                    <TextField label='Verify Password' placeholder='Verify Your Password' value={this.state.password2} type='password'
                                onChange={(event) =>this.setState({password2: event.target.value})} fullWidth required/>
                    <TextField label='Venmo Username' placeholder='Enter Venmo Username' value={this.state.venmo}
                                onChange={(event) => this.setState({venmo: event.target.value})} fullWidth/>
                    <Typography>{this.state.register_error}</Typography>
                    <Button style={{marginTop: "40px"}}onClick={() => {this.handleRegister();}} fullWidth>Register Me</Button>
                </Paper>
            </Grid>
        );}
}
export default LoginRegister;
import React from 'react';
import {
  Typography, Grid, Paper, TextField, Button
} from '@material-ui/core';
// import axios from 'axios';
import { auth, db } from '../firebase';
// import { response } from 'express';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            first_name: "", 
            last_name: "", 
            venmo: "", 
            login_password: "",
            password: "",
            password2: ""
        };
        // this.handleLogin = this.handleLogin.bind(this);
        this.handleRegister = this.handleRegister.bind(this);

    }
    handleRegister() {
        if (this.state.password !== this.state.password2) {
            this.setState({register_error: 'Passwords do not match!'});
            return;
        }
        // console.log("HELLO?")
        auth.createUserWithEmailAndPassword(this.state.email, this.state.password).then((userCredential) => {
            var user = userCredential.user;
            db.collection("users").add({
                login_email: this.state.email,
                password: this.state.password,
                // password2: this.state.password2,
                first_name: this.state.first_name,
                last_name : this.state.last_name,
                venmo: this.state.venmo,
                friends: [],
                receipts: [],
                uid: user.uid
            }).catch((err) => {
                console.log(err)
            });
            db.collection("users").where('uid', '==', user.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var currUser = doc.data();
                    this.setState({user: currUser});
                    window.location.href = `/users/${currUser.uid}`;
                    // console.log(this.state.user)
                    // console.log(`${doc.id} => ${doc.data()}`);
                });
            }).catch((err) => {
                this.setState({register_error: err.message});
            });
            // window.location.href = `/users/${user.uid}`;

        }).catch((error) => {
            // console.log("ERROR")
            console.log(error)
            this.setState({register_error: error.message});
        });
        // axios.post('user/', {login_email: this.state.email,
        // password: this.state.password,
        // password2: this.state.password2,
        // first_name: this.state.first_name,
        // last_name : this.state.last_name,
        // venmo: this.state.venmo})
        // .then(response => {
        //     let user = response.data;
        //     this.props.isLoggedIn(user);
        //     this.props.handleChange("Details of ", `${user.first_name} ${user.last_name}`);
        //     window.location.href = `#/users/${user._id}`;
        // }).catch(err => {this.setState({register_error: err.response.data});});
    }
    


    render() {
        const paperstyle= {padding:20, height:'70vh', width:'50%', margin:"20px auto", display: "block", overflow: "auto" };
        // console.log("shit");
        return (
            <Grid container>
                <Paper style={paperstyle}>
                    <Grid container alignContent='center'>
                        Sign Up!
                    </Grid>
                    <TextField label='First Name' placeholder='Enter Your First Name' value={this.state.first_name}
                                onChange={(event) =>this.setState({first_name: event.target.value})} fullWidth required/>
                    <TextField label='Last Name' placeholder='Enter Your Last Name' value={this.state.last_name}
                                onChange={(event) => this.setState({last_name: event.target.value})} fullWidth required/>
                    <TextField label='Email' placeholder='Enter Email' value={this.state.email}
                                onChange={(event) =>this.setState({email: event.target.value})} fullWidth required/>
                    <TextField label='Password' placeholder='Enter Password' value={this.state.password} type='password'
                                onChange={(event) => this.setState({password: event.target.value})} fullWidth required/>
                    <TextField label='Verify Password' placeholder='Verify Your Password' value={this.state.password2} type='password'
                                onChange={(event) =>this.setState({password2: event.target.value})} fullWidth required/>
                    <TextField label='Venmo Username' placeholder='Enter Venmo Username' value={this.state.venmo}
                                onChange={(event) => this.setState({venmo: event.target.value})} fullWidth/>
                    <Typography>{this.state.register_error}</Typography>
                    <Grid item>
                        <Button onClick={() => {
                            this.handleRegister();
                        }
                        } fullWidth>Register </Button>
                    </Grid>
                </Paper>
            </Grid>
        );}
}
export default Register;

import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import './ImageZero.css'
import Confetti from 'react-confetti'
import { useWindowDimensions } from 'react-native';



function IntroPage() {
    const { height, width } = useWindowDimensions();
    return (

        <div className='content' style={{height: {height}, width: {width}}}>
            <Confetti
                width={width}
                height={height}
            />
            <h1 style={{width:'auto', height:'auto', fontSize: 'auto'}}>
                Split.io
            </h1>
            <h3 style={{width:{width}, height:{height}}}>
                Splitting bills, made easy.
            </h3>

            <Grid  width={width} height={height}>
                <Button variant="contained" component={Link} to="/camera/done">
                    Start a Split!
                </Button>
                <Button variant="contained" component={Link} to="/register">
                    Sign Up
                </Button>
                <Button variant="contained" component={Link} to="/login">
                    Login
                </Button>
            </Grid>
        </div>
    );
}

export default IntroPage;
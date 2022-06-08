import React from 'react';
import background from '../imgs/backgroundAspect.jpeg'
import { Grid, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
// import { Card, Typography } from '@material-ui/core';
import './ImageZero.css'
import splitIcon from '../imgs/IMG_5761.jpg';
import Confetti from 'react-confetti'
import { useWindowDimensions } from 'react-native';



function IntroPage() {
    const { height, width } = useWindowDimensions();
    // console.log("Width", width);
    // console.log("Height", height);
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
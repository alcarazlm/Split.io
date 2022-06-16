import React from "react";
import { useState } from "react"
import { Button, Card, CardActions, CardHeader,Paper, Grid } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom'
import './paymentPage.css'
import firebase from "firebase/app";
// import fetchModel from '../../lib/fetchModelData';
// import axios from 'axios';
import { auth, db } from '../firebase';
import { PayPalButton } from "react-paypal-button-v2";
import VenmoImage from '../imgs/VenmoLogo.png'


function PaymentPage() {
    const colors = [`#556b2f`, `#bdb76b`, `#006400`, `#8fbc8f`, `#adff2f`, `#556b2f`, `#bdb76b`, `#006400`, `#8fbc8f`, `#adff2f`, `#556b2f`, `#bdb76b`, `#006400`, `#8fbc8f`, `#adff2f`];
    const location = useLocation();
    const { from } = location.state;
    const [active_user, setActiveUser] = useState(false);
    const [user_id, setUserID] = useState('');
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            setActiveUser(true);
            // user_id = uid;
            setUserID(user.uid)
        } else {
            // active_user = f
        }
    });
    let users = from.users;
    let rUsers = {}
    users.map((u) => {
        if (u.uid) {
            db.collection("users").where('uid', '==', u.uid).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // console.log(doc.data());
                    let holdReceipts = doc.data().receipts;
                    // console.log(holdReceipts);
                    if (!doc.data().receipts.includes(from.receipt.uid)){
                        holdReceipts.push(from.receipt.uid);
                        db.collection('users').doc(doc.id).update({
                            'receipts': holdReceipts
                        });
    
                    }
                });
            });

        }
    });
    users.map((user) => {
        // console.log(user);
        rUsers[user.uid] = user.total;
    })
    // console.log(from.receipt.uid)
    db.collection('receipts').doc(from.receipt.uid).update({
        'users' : rUsers
    });
    function handleVenmo(id, amount, message) {
        window.open(`https://venmo.com/${id}?txn=request&note=${message}&amount=${amount}`);
    }
    return (

        <div style={{display: 'grid',  alignItems: 'center', gridAutoRows: 'auto', justifyContent: 'space-between'}} className='content'>
            <Paper square style={{height: "calc(100vh - 100px)"}}>

                <h1 style={{gridColumnStart: '1', gridColumnEnd: '3'}}>
                    Split.io
                </h1>
                <h3 style={{ gridColumnStart: '1', gridColumnEnd: '3' ,marginBottom: "2.85em" }}>
                    Splitting bills, made easy.
                </h3>
                <Grid>
                {from.users.map((item, j) => {
                    return (
                        <div key={j} >
                            <ul display='inline'>
                                <Card className="card-row">
                                    <CardHeader className="card"
                                        action={item.venmo ? 
                                            <div>
                                                <img src={VenmoImage} onClick={() => {handleVenmo(item.venmo, item.total, from.receipt.location)}} alt="venmo logo" style={{ width: '50px', height: '50px', justifyContent: 'flex-start'}}/>

                                            
                                            {/* <PayPalButton style={{
                                                layout: 'horizontal',
                                                fundingicons: 'true',
                                            }}

                                                amount={item.total}
                                                // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                                onSuccess={(details, data) => {
                                                    alert("Transaction completed by " + details.payer.name.given_name);

                                                    return fetch("/paypal-transaction-complete", {
                                                        method: "post",
                                                        body: JSON.stringify({
                                                            orderID: data.orderID
                                                        })
                                                    });
                                                }}
                                            /> */}
                                            </div> : <div> </div>}
                                        title={`${item.first_name} ${item.last_name}`}
                                        subheader={`Cost: ${formatter.format(item.total)}`}
                                    />
                                </Card>
                            </ul>     
                        </div>
                    )
                    }
                    )}
                </Grid>
                </Paper>
            {active_user ? <Button style={{
                position: 'relative',
                marginTop: '2%',
                backgroundColor: 'lavander',
                gridColumnStart: '1',
                gridColumnEnd: '3'

            }} variant="contained" component={Link} to={`/users/${user_id}`}>
                Done!
            </Button> : <Button style={{
                position: 'relative',
                marginTop: '2%',
                backgroundColor: 'lavander',
                gridColumnStart: '1',
                gridColumnEnd: '3'
            }} variant="contained" component={Link} to="/">
                Done!
            </Button>
            }
        </div >

    );

}

export default PaymentPage;


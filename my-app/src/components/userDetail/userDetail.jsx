import React from 'react';
import {
  Typography, Grid, CardHeader, Card, CardActionArea, Button, TextField, Box
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import "firebase/auth";
import firebase from "firebase/app";
// import fetchModel from '../../lib/fetchModelData';
// import axios from 'axios';
import { auth, db } from '../../firebase';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, TouchableOpacity } from 'react-native-web';
import Modal from 'react-modal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import './userDetail.css';
const _ = require('lodash'); 
/**
 * Define UserDetail, a React componment of CS142 project #5
 */
const gridStyle = {
    'grid-auto-flow': 'column'

}
class UserDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: null,
            user_friends: [], 
            recent_receipts: [],
            active: false,
            showModal: false,
            allUsers: [],
            
        };
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        
    }

    handleOpenModal() {
        this.setState({ showModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false });
    }

    componentDidMount() {
        // db.settings({ timestampsInSnapshots: true });
        db.collection('users').get().then((snapshot) => {
            snapshot.forEach(doc => {
                if (doc.exists) {
                    let user = doc.data();
                    let holdUsers = this.state.allUsers;
                    holdUsers.push(user);

                } else {
                    // this.setState({user: null});
                    console.log("No data");
                }

            })
        }).catch((err) => {
            this.setState({login_error: err.message});
        });
            // console.log('item clicked');
        firebase.auth().onAuthStateChanged((user) => {
            // console.log(user);
            if (user) {
                var uid = user.uid;
                db.collection("users").where('uid', '==', uid).get().then((querySnapshot) => {
                    // console.log("here")
                    querySnapshot.forEach((doc) => {
                        var currUser = doc.data();
                        // console.log(currUser);
                        this.setState({userInfo: currUser});
                        this.setState({active: true});
                        // if (currUser.friends)
                        currUser.friends.map(f => {
                            db.collection("users").doc(f).get().then((querySnapshot) => {

                                    let friend = querySnapshot.data();
                                    // console.log(friend);
                                    var holdFriends = this.state.user_friends
                                    holdFriends.push(friend);
                                    // console.log(friend);
                                    this.setState({ user_friends: holdFriends});
                            }).catch((error) => {
                                this.setState({login_error: error.message});
                            });
                        });
                        currUser.receipts.map((r, j) => {
                            db.collection("receipts").doc(r).get().then((querySnapshot) => {
                                let receipt = querySnapshot.data();
                                receipt.ruid = r;
                                // console.log(receipt);
                                var holdReceipt = this.state.recent_receipts;
                                holdReceipt.push(receipt);
                                this.setState({ recent_receipts: holdReceipt});
                            }).catch((err) => {
                                this.setState({login_error: err.message});
                            });
                        });
                    });
                }).catch((err) => {
                    this.setState({login_error: err.message});
                });
            } else {
                // User is signed out
                // ...
            }
        });
    }
    signout() {
        auth().signOut().then(() => {
            // Sign-out successful.
          }).catch((error) => {
            this.setState({login_error: error.message});
          });

    }
    addFriend(friends, uid) {
        let holdFriends = this.state.userInfo.friends;
        // friends.push(this.state.userInfo.uid);
        db.collection("users").where('uid', '==', uid).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let new_id = doc.id;
                db.collection("users").where('uid', '==', this.state.userInfo.uid).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {

                        let user_id = doc.id;
                        friends.push(user_id);
                        holdFriends.push(new_id);
                        // console.log(user_id);
                        db.collection('users').doc(user_id).update({
                            'friends': holdFriends
                        });
                        db.collection('users').doc(new_id).update({
                            'friends': friends
                        });
                        // window.location.reload();
                        // let user = this.state.userInfo
                        // user.friends = holdFriends
                        // this.setState({userInfo: })
                    });
                });
                
            });
        });
        
        // window.location.reload();
    }
    // signin() {

    // }
    containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            // console.log(list[i]);
            // console.log(obj);
            // console.log()
            if (_.isEqual(list[i], obj)) {
                return true;
            }
        }
    
        return false;
    }

    render() {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        // console.log(this.state.userInfo);
        // console.log(this.state.user_friends);
        // console.log(this.state.recent_receipts);
        let user = this.state.userInfo;
        let userFriends = this.state.user_friends;
        let userReceipts = this.state.recent_receipts;
        let users = this.state.allUsers;
        // console.log(userFriends);
        // console.log(userReceipts);
        let rr;
        let friends;
        if (user !== null) {
            if (userReceipts !== []) {
                rr = this.state.recent_receipts.map((r,i) => {
                    // console.log(r);
                    return(
                        <Link to={`/receipt/${r.ruid}`} state={{id: r.ruid}} key={i}>
                            {/* <Card> */}
                            <Grid item component={Card} xs>
                                {/* <CardActionArea> */}
                                    <CardHeader 
                                    title={
                                    // <Typography align='space-between'>{r.location}</Typography> }
                                    <div className='receipt'>
                                        {/* <h3> */}
                                            <Text>{r.location}</Text>
                                        {/* </h3> */}
                                        <div className='receiptInfo'>
                                            {/* <h4> */}
                                            <Text>
                                                Subtotal: {formatter.format(r.subtotal)}
                                            </Text>
                                            {/* </h4> */}
                                            <br></br>
                                            {/* <h6> */}
                                            <Text>
                                                Tax: {formatter.format(r.tax)}
                                            </Text>
                                            {/* </h6> */}
                                        </div>
                                    </div>
                                    }
                                    />
                                {/* </CardActionArea> */}

                            </Grid>
                                {/* <Link to={`/receipts/${r.ruid}`}> */}
                                    {/* <CardActionArea onClick={this.props.handleChange(r.ruid)}> */}
                                {/* </Link> */}
                            {/* </Card> */}
                        </Link>
                    )
                });
            }
        }
        if (userFriends !== []) {
            friends = userFriends.map((f, i) => {
                return (
                    <div key={i}>
                        {/* <Grid className='friends' item component={Card} xs>
                            <CardHeader subheader= {`${f.first_name} ${f.last_name}`}/>
                        </Grid> */}
                        <TouchableOpacity style={{  width: '70%', marginTop: '2px', height: 50,justifyContent: 'center', borderRadius: 10, backgroundColor: 'gray', textAlign: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 'auto' }}> {f.first_name} {f.last_name}</Text>
                        </TouchableOpacity>
                            {/* <Card>  */}
                            {/* </Card> */}
                    </div>
                )
            });
        }
        let nonFriends;
        if (users !== []) {
            nonFriends = users.map((u,i) => {
                // console.log(this.state.userInfo);
                // console.log(u);
                // console.log(userFriends);
                if (!this.containsObject(u, userFriends) && !_.isEqual(this.state.userInfo, u)) {
                    // console.log(u);
                    return (
                        <div key={i}>
                        <TouchableOpacity style={{ height: 40, borderRadius: 12, backgroundColor: 'gray', textAlign: 'center',  flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                            this.addFriend(u.friends, u.uid);
                            let holdFriends = userFriends;
                            holdFriends.push(u);
                            this.setState({userFriends: holdFriends});
                            }}>
                            <Text style={{ textAlign: 'center', color: 'white', fontSize: 10 }}> {u.first_name} {u.last_name}</Text>
                        </TouchableOpacity>
                        </div>
                    )
                }
            })
        }
        return this.state.userInfo ? 
        (
            <div>
            <div>
            <form align="right" name="form1" method="post" action="log_out.php">
                {/* <label class="logoutLblPos">
                <input name="submit2" type="submit" id="submit2" value="log out">
                </label> */}
                {this.state.active ? <Button onClick={() => {this.signout();}} component={Link} to="/">Sign out</Button> : <Button component={Link} to="/login">Sign in!</Button>}
            </form>
            </div>
            <Card className='title'>
                <h1>{`Hello ${user.first_name},`}</h1>

                <h3>
                    Receipts
                </h3>
                <Grid container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center">
                    {rr ? rr : 
                    (
                        <div>
                            <Typography align='center'> 
                                You have no recent reciepts! 
                            </Typography> 
                        </div>
                    )
                    }
                    <div> 
                        <Link to={`/camera/done`}>
                            <button className="button-49">
                                Start a new Split!
                            </button>
                        </Link>
                    </div>
                    
                </Grid>
                {/* <div > */}
                    {/* <ul> */}
                <h3>Friends</h3>
                        {/* <Box m={5} pt={5}> */}
                            {/* <AddCircleIcon onClick={() => {this.handleOpenModal()}}/> */}
                        {/* </Box> */}
                    {/* </ul> */}
                {/* </div> */}
                <Modal
                    isOpen={this.state.showModal}
                    ariaHideApp={false}
                    contentLabel="Minimal Modal Example"
                >
                    <ExitToAppIcon onClick={() => {this.handleCloseModal()}} />
                    <Grid  style={{display: 'grid', gridAutoRows: 'auto'}} container
                        direction="column"
                        alignItems="center"
                    // justify="center"
                    >
                        {nonFriends ? (nonFriends)
                             :
                            (
                                <Typography>
                                    You are freinds with everyone on Split! Wow!
                                </Typography>
                            )
                        }
                        {/* <TextField id="standard-basic" label="Add a friend!" variant="standard" value={this.state.new_friend} onChange={(event) => { this.setState({ new_friend: event.target.value }) }} />
                        <AddCircleIcon onClick={() => { this.addNewFriend(); }} /> */}
                        {/* <h3>
                            Friends on the Receipt
                        </h3> */}
                        {/* <ul> */}
                        {/* {friends.map((person,k) => (
                            // <li key={k}>
                                <TouchableOpacity style={{ marginTop: 20, height: 50, width: '80%', borderRadius: 12, backgroundColor: 'gray', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 25, alignItems: 'center' }} onPress={() => this.removeUser(person)}>
                                    <Text style={{ color: 'white', fontSize: 18 }}> {person.first_name} {person.last_name}</Text>
                                </TouchableOpacity>
                            // </li>
                        ))} */}
                        {/* </ul> */}
                    </Grid>
                </Modal>
                <Grid  style={{display: 'grid', gridTemplateColumns: '0.5fr 0.5fr  0.5fr', gridAutoRows: 'auto', padding: '20px', textAlign: 'center'}} container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center">
                    {user.friends ? friends : <Typography align='center'> You don&apos;t have friends on Split yet!</Typography> }
                </Grid>
                <Button onClick={() => {this.handleOpenModal()}}>Add Friends</Button>
            </Card>
            </div>
        ) : <div></div>
    }
}

export default UserDetail;
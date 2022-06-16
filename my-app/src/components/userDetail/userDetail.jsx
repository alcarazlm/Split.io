import React from 'react';
import { Typography, Grid, Card, Button } from '@material-ui/core';
import {Link} from 'react-router-dom';
import "firebase/auth";
import firebase from "firebase/app";
import { auth, db } from '../../firebase';
import { Text, TouchableOpacity } from 'react-native-web';
import Modal from 'react-modal';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import './userDetail.css';
const _ = require('lodash'); 

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
        db.collection('users').get().then((snapshot) => {
            snapshot.forEach(doc => {
                if (doc.exists) {
                    let user = doc.data();
                    let holdUsers = this.state.allUsers;
                    holdUsers.push(user);
                    this.setState({allUsers: holdUsers})

                } else {
                    console.log("No data");
                }

            })
        }).catch((err) => {
            this.setState({login_error: err.message});
        });
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                db.collection("users").where('uid', '==', uid).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        var currUser = doc.data();
                        this.setState({userInfo: currUser});
                        this.setState({active: true});
                        currUser.friends.map(f => {
                            db.collection("users").doc(f).get().then((querySnapshot) => {
                                    let friend = querySnapshot.data();
                                    var holdFriends = this.state.user_friends
                                    holdFriends.push(friend);
                                    this.setState({ user_friends: holdFriends});
                            }).catch((error) => {
                                this.setState({login_error: error.message});
                            });
                        });
                        currUser.receipts.map((r, j) => {
                            db.collection("receipts").doc(r).get().then((querySnapshot) => {
                                let receipt = querySnapshot.data();
                                receipt.ruid = r;
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
                        db.collection('users').doc(user_id).update({
                            'friends': holdFriends
                        });
                        db.collection('users').doc(new_id).update({
                            'friends': friends
                        });
                    });
                });
                
            });
        });
        
    }
    // signin() {

    // }
    containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
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
        let user = this.state.userInfo;
        let userFriends = this.state.user_friends;
        let userReceipts = this.state.recent_receipts;
        let users = this.state.allUsers;
        let rr;
        let friends;
        if (user !== null) {
            if (userReceipts !== []) {
                rr = this.state.recent_receipts.map((r,i) => {
                    return(
                        <Link to={`/receipt/${r.ruid}`} state={{uid: user.uid,id: r.ruid}} key={i}>
                            <Grid item component={Card} container>
                                    <div className='receipt' >
                                        <h3>{r.location}</h3>
                                        <div className='receiptInfo'>
                                            <h5>
                                                Subtotal: {formatter.format(r.subtotal)}
                                            </h5>
                                            <h5>
                                                Tax: {formatter.format(r.tax)}
                                            </h5>
                                        </div>
                                    </div>

                            </Grid>
                        </Link>
                    )
                });
            }
        }
        if (userFriends !== []) {
            friends = userFriends.map((f, i) => {
                return (
                    <div key={i}>
                        <TouchableOpacity style={{  width: '70%', marginTop: '2px', height: 50,justifyContent: 'center', borderRadius: 10, backgroundColor: 'gray', textAlign: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 'auto' }}> {f.first_name} {f.last_name}</Text>
                        </TouchableOpacity>
                    </div>
                )
            });
        }
        let nonFriends;
        if (users !== []) {
            nonFriends = users.map((u,i) => {
                if (!this.containsObject(u, userFriends) && !_.isEqual(this.state.userInfo, u)) {
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
                alignItems="stretch"
                justifyContent="center"
                width='350px'>
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
                <h3>Friends</h3>
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
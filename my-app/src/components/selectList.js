import React, { Component } from 'react';
import { ScrollView, View, Text, StatusBar, TouchableOpacity } from 'react-native-web';
import Carousel from 'react-elastic-carousel';
import firebase from "firebase/app";
import { Grid, Button, Typography, TextField } from '@material-ui/core';
import { db } from '../firebase';
import Modal from 'react-modal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link } from 'react-router-dom';
// import Payment from './paymentPage';
import { Avatar, AvatarGroup } from '@mui/material';
import './selectList.css'
import { useLocation } from "react-router-dom";

const withLocation = Component => props => {
    const location = useLocation();
  
    return <SelectList {...props} location={location} />;
  };

var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});



class SelectList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            receipt: null,
            currPointer: '',
            count: 0,
            user_friends: [],
            uf_copy: [],
            selectedItems: [],
            index: 0,
            userItems: {},
            users: [],
            new_friend: '',
            showModal: false,
            isLoading: false,
            receipt_uid: '',
            itmes: [],
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
    onClicker2(curr, next) {
        this.setState({index: curr});
        const { receipt } = this.state;
        const { personData } = this.state;
        let totalPrice = 0.0;
        if (personData[curr].selectedItems.length > 0) {
            for (let j = 0; j < receipt.items.length; j++) {
                if (personData[curr].selectedItems.includes(j)) {
                    receipt.items[j].isSelected = true;
                    totalPrice += receipt.items[j].price;
                }
            }
            personData[curr].totalPrice = totalPrice;
        } else {
            for (let j = 0; j < receipt.items.length; j++) {
                receipt.items[j].isSelected = false;
            }

        }

        this.setState({ count: curr })


    }

    componentDidMount() {
        const {location} = this.props;
        let ruid = location.state.from;
        this.setState({receipt_uid: ruid});
        db.collection('receipts').doc(ruid).get().then((querySnapshot) => {
            let receipt = querySnapshot.data();
            console.log(receipt);
            this.setState({items: receipt.items});
            this.setState({receipt: receipt});
        })
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                var uid = user.uid;
                db.collection("users").where('uid', '==', uid).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        var currUser = doc.data();
                        this.setState({ user: currUser });
                        this.setState({ users: [...this.state.users, currUser] })
                        currUser.friends.map((f, j) => {
                            db.collection("users").doc(f).get().then((querySnapshot) => {
                                let friend = querySnapshot.data();
                                var holdFriends = this.state.user_friends
                                holdFriends.push(friend);
                                this.setState({ user_friends: holdFriends});
                                this.setState({uf_copy: holdFriends});
                            }).catch((err) => {
                                this.setState({ login_error: err.message });
                            });
                        });
                        currUser.receipts.map((r, j) => {
                            db.collection("receipts").doc(r).get().then((querySnapshot) => {
                                let receipt = querySnapshot.data();
                                receipt.ruid = r;
     
                                this.setState({ recent_receipts: [...this.state.recent_receipts, receipt] });                                // console.log(this.state.recent_receipts);
                            }).catch((err) => {
                                this.setState({ login_error: err.message });
                            });
                        });
                    });
                }).catch((err) => {
                    this.setState({ login_error: err.message });
                });
            } else {
                let currUser = {first_name: "You", last_name:"", friends:[], receipts:[]}
                this.setState({ user: currUser });
                this.setState({ users: [...this.state.users, currUser] })
            }
        });
    }

    goToLoad = () => {
        this.setState({ isLoading: true })
    }



    selectionHandler = (ind) => {
        let holdUserItems = this.state.userItems;
        let index = this.state.index;
        holdUserItems[ind] ??= [];
        if (holdUserItems[ind].includes(index)) {
            holdUserItems[ind] = holdUserItems[ind].filter(function (i) {
                return i !== index;
            })
        } else {
            holdUserItems[ind].push(index);
        }
        this.setState({userItems: holdUserItems});

        const { personData, count, selectedItems, receipt } = this.state;
        let arr = receipt.items.map((item, index) => {

            if (ind === index) {
                item.isSelected = !item.isSelected;

            }
            return { ...item }
        })
        let its = []
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].isSelected) {
                its = [...its, i];
            }
        }
        let pp = [...personData];
        let totalPrice = 0.0;
        if (personData[count]) {
            personData[count].selectedItems = [...its];

        }
        this.setState({ personData: pp });


    }


    addtoUsers = (friend) => {
        this.setState({ users: [...this.state.users, friend] });
        this.setState({
            user_friends: this.state.user_friends.filter(function (person) {
                return person !== friend;
            })
        });
    }
    
    containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
    
        return false;
    }

    addNewFriend() {
        let friend = this.state.new_friend;
        let first_name = '';
        let last_name = '';
        if (friend.split(/\W+/).length === 2) {
            [first_name, last_name] = friend.split(/\W+/);
        } else {
            first_name = friend;
            last_name = "";
        }
        let friend_info = { first_name: first_name, last_name: last_name };
        this.setState({ users: [...this.state.users, friend_info] });
        this.setState({ new_friend: "" });
    }
    removeUser = (user) => {
        if (user !== this.state.user) {
            this.setState({
                users: this.state.users.filter(function (person) {
                    return person !== user;
                })
            });
            if (this.containsObject(user, this.state.uf_copy)) {
                this.setState({ user_friends: [...this.state.user_friends, user] });
            }
        }
    }
    calcTotals = () => {
        let holdInfo = this.state.userItems;
        let receipt = this.state.receipt;
        let holdUsers = this.state.users;
        let user;
        let holdData = this.state.receipt.items;
        for (var u in this.state.userItems) {
            for (var i of holdInfo[u]) {
                holdUsers[i].total ??= 0.0
                holdUsers[i].total += holdData[u].price / holdInfo[u].length;
            }
        }
        for (var k in holdUsers) {
            holdUsers[k].total += (holdUsers[k].total / receipt.subtotal) * (receipt.tax + receipt.tip)   
        }
        this.setState({users: holdUsers});
    }
    render() {
        const { user, user_friends, users, isLoading, personData, items, receipt } = this.state;

        let friend_list;
        if (user_friends !== []) {
            friend_list = user_friends.map((f, i) => {
                return (
                        <TouchableOpacity onPress={() => {
                            this.addtoUsers(f)
                        }} style={{ marginTop: 20, height: 50, width: '80%', borderRadius: 12, backgroundColor: (f.isSelected ? 'green' : 'gray'), justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 25, alignItems: 'center' }} key={i}>
                            <Text style={{ color: 'white', fontSize: 18 }}> {`${f.first_name} ${f.last_name}`}</Text>
                        </TouchableOpacity>
                );
            });
        }
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    isOpen={this.state.showModal}
                    ariaHideApp={false}
                    contentLabel="Minimal Modal Example"
                >
                    <ExitToAppIcon onClick={this.handleCloseModal} />
                    <Grid container
                        direction="column"
                        alignItems="center"
                    // justify="center"
                    >
                        {friend_list ? (friend_list)
                             :
                            (
                                <Typography>
                                    You don&apos;t have any freinds on Split! Add your friends names bellow.
                                </Typography>
                            )
                        }
                        <TextField id="standard-basic" label="Add a friend!" variant="standard" value={this.state.new_friend} onChange={(event) => { this.setState({ new_friend: event.target.value }) }} />
                        <AddCircleIcon onClick={() => { this.addNewFriend(); }} />
                        <h3>
                            Friends on the Receipt
                        </h3>
                        {users.map((person,k) => (
                                <TouchableOpacity style={{ marginTop: 20, height: 50, width: '80%', borderRadius: 12, backgroundColor: 'gray', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 25, alignItems: 'center' }} onPress={() => this.removeUser(person)} key={k}>
                                    <Text style={{ color: 'white', fontSize: 18 }}> {person.first_name} {person.last_name}</Text>
                                </TouchableOpacity>
                        ))}
                    </Grid>
                </Modal>
                <StatusBar barStyle='dark-content' />
                <ScrollView contentContainerStyle={{ flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {receipt ? receipt.items.map((item, index) => {
                            return (
                                    <TouchableOpacity onPress={() => this.selectionHandler(index)} style={{ marginTop: 20, height: 50, width: '80%', borderRadius: 12, backgroundColor: '#E6E6FA', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 25, alignItems: 'center' }} key={index}>
                                        <Text style={{ color: '#778899', fontSize: 18 }}> {item.item_name} {formatter.format(item.price)}</Text>
                                        <AvatarGroup>
                                        {this.state.userItems[index] ?
                                         
                                        (
                                            this.state.userItems[index].map((u, i) => {
                                            let user = this.state.users[u];
                                            return (
                                                <Avatar key={i}>{user.first_name[0]}{user.last_name[0]}</Avatar>
                                            )
                                        }
                                        )) : <div></div>}
                                        </AvatarGroup>

                                    </TouchableOpacity>
                                // </div>
                            );
                        }) : <div></div>}
                        <Link to='/pay' state={{from: this.state}}>
                            <Button onClick={() => {this.calcTotals()}} style={{marginTop: "30px", display: "flex", flexDirection: "column"}}>Finish Split!</Button>
                            
                        </Link>
                        <Carousel onNextEnd={(currentItem, nextItem) => 
                            this.onClicker2(currentItem.index, nextItem)
                            } infiniteLoop={true}
                            style={{ marginTop: 50 }} onPrevEnd={(currentItem, pageIndex) => { this.onClicker2(pageIndex, currentItem) }
                            }>

                            {this.state.users.map((person, l) => (
                                <div key={l}>
                                    <h3>  
                                        {person.first_name} {person.last_name} 
                                    </h3>
                                </div>
                                ))}

                        </Carousel>
                        {user ?
                            (
                                <div>
                                    <AddCircleIcon style={{ display: 'flex', flextDirection: 'column', marginTop: 50 }} onClick={this.handleOpenModal} />
                                </div>
                            ) : <h1 style={{ marginTop: 50 }}>
                                Loading..
                            </h1>
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default withLocation(SelectList);


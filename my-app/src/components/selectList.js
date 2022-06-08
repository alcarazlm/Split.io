import React, { Component, useEffect } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, TouchableOpacity } from 'react-native-web';
import Carousel from 'react-elastic-carousel';
import firebase from "firebase/app";
import { Card, CardHeader, CardActionArea, CardMedia, Grid, CardActions, Button, Typography, TextField } from '@material-ui/core';
import { auth, db } from '../firebase';
import Modal from 'react-modal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Link } from 'react-router-dom';
import Payment from './paymentPage';
import { Avatar, AvatarGroup } from '@mui/material';
import './selectList.css'
import { useLocation } from "react-router-dom";

const withLocation = Component => props => {
    const location = useLocation();
  
    return <SelectList {...props} location={location} />;
  };




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
            dummyData: [
                {
                    name: 'Cheeseburger',
                    price: 15.99
                },
                {
                    name: 'Cheese Pizza',
                    price: 12.99
                },
                {
                    name: 'Chili Cheese Dog',
                    price: 9.99
                },
                {
                    name: 'Large Soda',
                    price: 2.99
                },
                {
                    name: 'Vanilla Ice Cream',
                    price: 3.99
                },
                {
                    name: 'French Fries',
                    price: 9.99
                },
            ],
            personData: [
                {
                    person: 'Robert',
                    selectedItems: [],
                    totalPrice: 0.0,
                },
                {
                    person: 'Karen',
                    selectedItems: [],
                    totalPrice: 0.0,

                },
                {
                    person: 'Luis',
                    selectedItems: [],
                    totalPrice: 0.0,

                },
                {
                    person: 'Josh',
                    selectedItems: [],
                    totalPrice: 0.0,

                },
            ],
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
        // console.log(curr);
        // console.log(next);
        this.setState({index: curr});
        const { receipt, users, count } = this.state;
        const { personData } = this.state;
        let totalPrice = 0.0;
        // for (let j = 0; j < receipt.items.length; j++) {
        //     receipt.items[j].isSelected = false;
        // }
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
        // console.log(location.state.from);
        let ruid = location.state.from;
        this.setState({receipt_uid: ruid});
        db.collection('receipts').doc(ruid).get().then((querySnapshot) => {
            let receipt = querySnapshot.data();
            console.log(receipt);
            this.setState({items: receipt.items});
            this.setState({receipt: receipt});
        })
        // const {receiptid} = this.props.location  ? state
        // console.log(receiptid);
        firebase.auth().onAuthStateChanged((user) => {
            // console.log('here');
            if (user) {
                var uid = user.uid;
                // console.log('here');
                // console.log(uid);
                // db.collection('users').doc(uid)
                db.collection("users").where('uid', '==', uid).get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        var currUser = doc.data();
                        this.setState({ user: currUser });
                        this.setState({ users: [...this.state.users, currUser] })
                        currUser.friends.map((f, j) => {
                            db.collection("users").doc(f).get().then((querySnapshot) => {
                                let friend = querySnapshot.data();
                                // console.log(friend)
                                var holdFriends = this.state.user_friends
                                holdFriends.push(friend);
                                this.setState({ user_friends: holdFriends});
                                this.setState({uf_copy: holdFriends});
                                // console.log(this.state.user_friends)
                                // return friend;
                            }).catch((err) => {
                                this.setState({ login_error: err.message });
                            });
                            // console.log(this.state.user_friends)
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
                        // window.location.href = `#/users/${currUser.uid}`;
                    });
                }).catch((err) => {
                    this.setState({ login_error: err.message });
                });
            } else {
                let currUser = {first_name: "You", last_name:"", friends:[], receipts:[]}
                this.setState({ user: currUser });
                // this.setState({})
                this.setState({ users: [...this.state.users, currUser] })
            }
        });
        // let arr = this.state.receipt.items.map((item, index) => {
        //     item.isSelected = false
        //     return { ...item };

        // })
        // let tempReceipt = this.state.receipt;
        // tempReceipt.items = arr;
        // this.setState({ receipt: tempReceipt });
    }

    goToLoad = () => {
        this.setState({ isLoading: true })
    }



    selectionHandler = (ind) => {
        // console.log(ind);
        // this.setState({})
        let holdUserItems = this.state.userItems;
        // let users = this.state.users;
        let index = this.state.index;
        // console.log(index);
        // let items = this.state.items
        holdUserItems[ind] ??= [];
        if (holdUserItems[ind].includes(index)) {
            holdUserItems[ind] = holdUserItems[ind].filter(function (i) {
                return i !== index;
            })
        } else {
            holdUserItems[ind].push(index);
        }
        this.setState({userItems: holdUserItems});
        // console.log(holdUserItems);

        const { dummyData, personData, count, selectedItems, receipt } = this.state;
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
        // console.log(personData[count].selectedItems)
        // console.log()

        // this.setState({ receipt.items: arr });
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
        // console.log(list);
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
        // console.log(receipt)
        // console.log(typeof receipt.tax);
        let holdUsers = this.state.users;
        let user;
        let holdData = this.state.receipt.items;
        // console.log(holdUsers);
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
        // console.log(this.state.users);
//         let holdInfo = this.state.userItems;
//         // console.log(holdInfo);
//         let holdUsers = this.state.users;
//         let user;
//         let holdData = this.state.receipt.items;
//         for (var u in this.state.userItems) {
//             for (var i of holdInfo[u]) {
//                 // console.log(i);
//                 holdUsers[i].total ??= 0.0
//                 holdUsers[i].total += holdData[u].price / holdInfo[u].length;
//             }
//         }
//         this.setState({users: holdUsers});
//         console.log(this.state.users);
    }
    render() {
        const { user, user_friends, users, isLoading, dummyData, personData, items, receipt } = this.state;
        // console.log(items);
        // console.log(receipt);

        let friend_list;
        // console.log(user_friends);
        if (user_friends !== []) {
            friend_list = user_friends.map((f, i) => {
                return (
                        <TouchableOpacity onPress={() => {
                            // if f.isSelected
                            this.addtoUsers(f)
                        }} style={{ marginTop: 20, height: 50, width: '80%', borderRadius: 12, backgroundColor: (f.isSelected ? 'green' : 'gray'), justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 25, alignItems: 'center' }} key={i}>
                            <Text style={{ color: 'white', fontSize: 18 }}> {`${f.first_name} ${f.last_name}`}</Text>
                            {/* <Text style={{ color: 'white', fontSize: 18 }}>{f.isSelected ? 'selected' : 'not selected'}</Text> */}
                        </TouchableOpacity>

                    // <div></div>
                );
            });
        }
        // const location = useLocation();
        // const {receiptid} = location.state;
        // console.log(users);
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
                        {/* <ul> */}
                        {users.map((person,k) => (
                            // <li key={k}>
                                <TouchableOpacity style={{ marginTop: 20, height: 50, width: '80%', borderRadius: 12, backgroundColor: 'gray', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 25, alignItems: 'center' }} onPress={() => this.removeUser(person)} key={k}>
                                    <Text style={{ color: 'white', fontSize: 18 }}> {person.first_name} {person.last_name}</Text>
                                </TouchableOpacity>
                            // </li>
                        ))}
                        {/* </ul> */}
                    </Grid>
                </Modal>
                <StatusBar barStyle='dark-content' />
                <ScrollView contentContainerStyle={{ flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {receipt ? receipt.items.map((item, index) => {
                            // console.log(this.state.userItems[index]);
                            return (
                                // <div key={index}>
                                    <TouchableOpacity onPress={() => this.selectionHandler(index)} style={{ marginTop: 20, height: 50, width: '80%', borderRadius: 12, backgroundColor: '#E6E6FA', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 25, alignItems: 'center' }} key={index}>
                                        <Text style={{ color: '#778899', fontSize: 18 }}> {item.item_name} ${item.price}</Text>
                                        {/* <Text style={{ color: 'white', fontSize: 18 }}>{item.isSelected ? 'selected' : 'not selected'}</Text> */}
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
                                // console.log(person.)
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


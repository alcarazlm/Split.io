import React from 'react';
import {
  Divider,
  List,
  ListItem,
  // ListItemText,
}
from '@material-ui/core';
import { auth, db } from '../../firebase';
import {Link} from 'react-router-dom';
// import './selectList.css'
import { useLocation } from "react-router-dom";
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, TouchableOpacity } from 'react-native-web';
import Carousel from 'react-elastic-carousel';
import { Button, Card, CardActions, CardHeader, Grid, AppBar, Toolbar, Paper } from '@material-ui/core';
import './receipt.css'



const withLocation = Component => props => {
  const location = useLocation();

  return <ReceiptObject {...props} location={location} />;
};
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (from suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

/**
 * Define UserList, a React componment of CS142 project #5
 */
class ReceiptObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receipt: undefined,
      receipt_users: [],
      user_id: '',
      count: 0

      //active_user: undefined
    };
  }

  componentDidMount() {
    const {location} = this.props;
    // console.log(location.state.id);
    this.setState({user_id: location.state.uid})

    let ruid = location.state.id;
    this.setState({receipt_uid: ruid});
    db.collection('receipts').doc(ruid).get().then((querySnapshot) => {
        let receipt = querySnapshot.data();
        console.log(receipt);
        // this.setState({items: receipt.items});
        this.setState({receipt: receipt});
        let users = receipt.users;
        // console.log(typeof users);
        Object.entries(users).map((u) => {
          // console.log(u[0])
          db.collection("users").where('uid', '==', u[0]).get().then((querySnapshot) => {
            // console.log(querySnapshot.data())
            querySnapshot.forEach((doc) => {
              // console.log(doc.data());
              var friend = doc.data();
              friend.price = u[1];
              // console.log(friend)
              var holdUsers = this.state.receipt_users
              holdUsers.push(friend);
              this.setState({ receipt_users: holdUsers});
              this.setState({uf_copy: holdUsers});
            });
              // console.log(this.state.user_friends)
              // return friend;
          }).catch((err) => {
              console.log(err.message)
              this.setState({ login_error: err.message });
          });
          // console.log(this.state.user_friends)
      });

    });


  }
  onClicker2(curr, next) {
    // console.log(curr);
    // console.log(next);
    this.setState({index: curr});
    const { receipt } = this.state;
    const { personData } = this.state;
    // let totalPrice = 0.0;
    // for (let j = 0; j < receipt.items.length; j++) {
    //     receipt.items[j].isSelected = false;
    // }
    // if (personData[curr].selectedItems.length > 0) {
    //     for (let j = 0; j < receipt.items.length; j++) {
    //         if (personData[curr].selectedItems.includes(j)) {
    //             receipt.items[j].isSelected = true;
    //             totalPrice += receipt.items[j].price;
    //         }
    //     }
    //     personData[curr].totalPrice = totalPrice;
    // } else {
    //     for (let j = 0; j < receipt.items.length; j++) {
    //         receipt.items[j].isSelected = false;
    //     }

    // }

    this.setState({ count: curr })


}

  render() {
    let chosen_receipt = this.state.receipt;
    let receipt_users = this.state.receipt_users;
    let items;
    if (chosen_receipt) {
      // let chosen_receipt = this.state.receipt[Math.floor(Math.random() * this.state.receipt.length)];
      // if (this.state.receipt !== undefined) {
      items = chosen_receipt.items.map((item, index) => (
          <div key={index} style={{alignContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={{ marginTop: 10, height: 40, width: '80%', borderRadius: 12, backgroundColor: '#E6E6FA', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
              <Text style={{ color: '#778899', fontSize: 18 }}> {item.item_name} {formatter.format(item.price)}</Text>
              {/* <Text style={{ color: 'white', fontSize: 18 }}>{item.isSelected ? 'selected' : 'not selected'}</Text> */}
              {/* <AvatarGroup>
              {this.state.userItems[index] ?
                
              (
                  this.state.userItems[index].map((u, i) => {
                  let user = this.state.users[u];
                  return (
                      <Avatar>{user.first_name[0]}{user.last_name[0]}</Avatar>
                  )
              }
              )) : <div></div>}
              </AvatarGroup> */}

          </TouchableOpacity>
          {/*   <Divider /> */}
          </div>
      ));
    }
    let users;
    // console.log(receipt_users)
    if (receipt_users !== undefined) {
      users = Object.entries(receipt_users).map((u, i) => (
        // console.log(u);
          // return (
          // <div key={i}>
          <div key={i} style={{alignContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={{ marginTop: 10, height: 45, width: '80%', borderRadius: 12, backgroundColor: '#E6E6FA', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
              <h3>
                {u[1].first_name} {u[1].last_name}
              </h3> 
              <Text style={{ color: '#778899', fontSize: 18 }}> {formatter.format(u[1].price)}</Text>
              {/* style={{ color: '#778899', fontSize: 18 }}> {item.item_name} ${item.price}</Text> */}

          </TouchableOpacity>
              {/* <h3>  
                  {u[1].first_name} {u[1].last_name} 
              </h3>
              <h6>
                {u[0]}
              </h6> */}
          </div>
      // )
      ))
    }
    // console.log(users)
    // console.log(this.state.receipt);

    return this.state.receipt ? (
      <div style={{alignItems: 'center'}}>
        <div className="content">
          <h1>
              Split.io
          </h1>
        </div>
        <h3 style={{fontSize: 36 }}>
          {this.state.receipt.location}
        </h3>
        {/* <List component="nav"> */}
          <h3>
            Items
          </h3>
          {items}
        {/* </List> */}
        <h3>
          Receipt Users
        </h3>
        {/* <Carousel onNextEnd={(currentItem, nextItem) => this.onClicker2(currentItem.index, nextItem)} infiniteLoop={true}
          style={{ marginTop: 50 }} onPrevEnd={(currentItem, pageIndex) => { this.onClicker2(pageIndex, currentItem) }}>
      </Carousel> */}
      {users}
      <Button style={{
          position: 'relative',
          marginTop: '2%',
          // fillRule: 'inherit',
          backgroundColor: 'black',
          // gridColumnStart: '1',
          // gridColumnEnd: '3',

      }} variant="contained" component={Link} to={`/users/${this.state.user_id}`}>
          Done
      </Button>

      </div>
    ) : <div></div>;
  }
}

export default withLocation(ReceiptObject);
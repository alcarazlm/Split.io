import React from 'react';
import { db } from '../../firebase';
import {Link} from 'react-router-dom';
// import './selectList.css'
import { useLocation } from "react-router-dom";
import { Text, TouchableOpacity } from 'react-native-web';
// import Carousel from 'react-elastic-carousel';
import { Button } from '@material-ui/core';
import './receipt.css'



const withLocation = Component => props => {
  const location = useLocation();

  return <ReceiptObject {...props} location={location} />;
};
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

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
        this.setState({receipt: receipt});
        let users = receipt.users;
        Object.entries(users).map((u) => {
          db.collection("users").where('uid', '==', u[0]).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              var friend = doc.data();
              friend.price = u[1];
              var holdUsers = this.state.receipt_users
              holdUsers.push(friend);
              this.setState({ receipt_users: holdUsers});
              this.setState({uf_copy: holdUsers});
            });
          }).catch((err) => {
              console.log(err.message)
              this.setState({ login_error: err.message });
          });
      });

    });


  }
  onClicker2(curr, next) {
    this.setState({index: curr});
    const { receipt } = this.state;
    const { personData } = this.state;
    this.setState({ count: curr })


}

  render() {
    let chosen_receipt = this.state.receipt;
    let receipt_users = this.state.receipt_users;
    let items;
    if (chosen_receipt) {
      items = chosen_receipt.items.map((item, index) => (
          <div key={index} style={{alignContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={{ marginTop: 10, height: 40, width: '80%', borderRadius: 12, backgroundColor: '#E6E6FA', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
              <Text style={{ color: '#778899', fontSize: 18 }}> {item.item_name} {formatter.format(item.price)}</Text>

          </TouchableOpacity>
          </div>
      ));
    }
    let users;
    if (receipt_users !== undefined) {
      users = Object.entries(receipt_users).map((u, i) => (
          <div key={i} style={{alignContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={{ marginTop: 10, height: 45, width: '80%', borderRadius: 12, backgroundColor: '#E6E6FA', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center' }}>
              <h3>
                {u[1].first_name} {u[1].last_name}
              </h3> 
              <Text style={{ color: '#778899', fontSize: 18 }}> {formatter.format(u[1].price)}</Text>

          </TouchableOpacity>
          </div>
      ))
    }

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
          <h3>
            Items
          </h3>
          {items}
        <h3>
          Receipt Users
        </h3>
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
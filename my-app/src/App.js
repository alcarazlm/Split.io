import './App.css';
import React from 'react';
// import NavBar from './components/NavBar';
import ReceiptCam from './components/ReceiptCam';
import IntroPage from './components/IntroPage';
import Login from './components/login';
import Register from './components/register';
// import { getAuth } from 'firebase/auth'
// import Calender from './components/calanderPage/calanderPage';
import UserDetail from './components/userDetail/userDetail'
import ReceiptObject from './components/receipts/receipt';
import {
  HashRouter, Route, Routes
} from 'react-router-dom';
import {
  Grid, Paper
} from '@material-ui/core';
import { auth, db } from "./firebase";

class Split extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currState: null,
      // currName: 'Luis\'s Photo Sharing App',
      currUser: null,
      currFirstName: '',

    };
    // this.isLoggedIn = this.isLoggedIn.bind(this);
  }
  handleChange = (pageName, userName) => {
    this.setState({currState: pageName});
    this.setState({currName: userName});
  };
  componentDidMount() {
    const user = auth.currentUser;
    if (user) {
      this.setState({currUser: user.uid});
    };
  }
  // isLoggedIn() {
  //   // this.setState({currUser: user});
  //   // if(user) {
  //   //   this.setState({currFirstName: user.first_name});
  //   // }
  //   const user = auth.currentUser;
  //   if (user) {
  //     this.setState({currUser: user.uid})
  //   };
  //   // } else {
  //   //   // No user is signed in.
  //   // }
  // };
  
  render() {
    // console.log(this.state.currUser);
    // getAuth()
    // .getUser('2sZiYvZblR3sGDBilaLX')
    // .then((userRecord) => {
    //   // See the UserRecord reference doc for the contents of userRecord.
    //   console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    // })
    // .catch((error) => {
    //   console.log('Error fetching user data:', error);
    // });
    return (
      <HashRouter>
      <div className='pages'>
      <Grid item>
          <Paper>
            <Routes>
              <Route path="/home"
              //   render={ props => <IntroPage handleChange={this.handleChange} {...props} /> }
              // />
              element={<IntroPage/>}/>
              <Route path="/login"
              //   render={ props => <LoginRegister isLoggedIn={this.isLoggedIn} handleChange={this.handleChange} {...props} /> }
              // />
              element={<Login/>}/>
              <Route path='/register' element={<Register/>}/>
              <Route path="/receipt-cam"
              //   render={ props => <ReceiptCam handleChange={this.handleChange} {...props} /> }
              // />
              element={<ReceiptCam/>}/>
              <Route path="/receipt"
              //   render={ props => <ReceiptObject handleChange={this.handleChange} {...props} /> }
              // />
              element={<ReceiptObject/>}/>
              {/* <Route path="/users/:userId" render={ props => <UserDetail handleChange={this.handleChange} {...props} /> }/> */}
              <Route path="/users/:userId" element={<UserDetail/>}/>
              {/* <Route exact path="/">
                {loggedIn ? <Redirect to="/dashboard" /> : <PublicHomePage />}
              </Route>


              {
              this.state.currUser ?
                <Route path="/calander/:userId" render ={ props => <Calender handleChange={this.handleChange} {...props} /> }/>
              :
                <Navigate
             path="/calander/:userId" to="/login-register" />
              } */}

              {/* {
              this.state.currUser ? ( */}
              {/* <Route path="/" render={ props => <IntroPage handleChange={this.handleChange} {...props} /> }/> */}
              <Route path="/" element={<IntroPage/>}/>
              {/* )
              :
                <Navigate
             path="/" to="/login-register" />
              } */}
            </Routes>
          </Paper>
        </Grid>
      {/* <TextBox />
      <ReceiptCam />
      <TextBox />
      <ImageTwo />
      <TextBox />
      <ImageThree /> */}
    </div>
    </HashRouter>
    );
  }
}
export default Split;

// ReactDOM.render(
//   <Split />,
//   document.getElementById('splitapp'),
// );

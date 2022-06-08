import React, { Component, useEffect, useState } from 'react';
// import { Button } from 'react-native-web';
import { auth, db } from '../firebase';
import { Card, CardHeader, CardActionArea, CardMedia, Grid, CardActions, Button, Typography, TextField } from '@material-ui/core';
import { Link, useLocation } from 'react-router-dom';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, TouchableOpacity } from 'react-native-web';
import Modal from 'react-modal';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const jsonfile = {
  "ocr_type" : "receipts",
  "request_id" : "P_128.12.123.100_l40ev328_j5i",
  "ref_no" : "ocr_nodejs_123",
  "file_name" : "receiptMock.jpeg",
  "request_received_on" : 1654379540288,
  "success" : true,
  "image_width" : 799,
  "image_height" : 2613,
  "image_rotation" : 0,
  "recognition_completed_on" : 1654379540835,
  "receipts" : [ {
    "merchant_name" : "THE TREEHOUSE",
    "merchant_address" : null,
    "merchant_phone" : null,
    "merchant_website" : null,
    "merchant_tax_reg_no" : null,
    "merchant_company_reg_no" : null,
    "region" : null,
    "mall" : null,
    "country" : "US",
    "receipt_no" : "920",
    "date" : "2022-03-21",
    "time" : null,
    "items" : [ {
      "amount" : 12.99,
      "description" : "CHEESE PIZZA",
      "flags" : "",
      "qty" : 1,
      "remarks" : null,
      "unitPrice" : null
    }, {
      "amount" : 15.99,
      "description" : "CHEESEBURGER",
      "flags" : "",
      "qty" : 1,
      "remarks" : null,
      "unitPrice" : null
    }, {
      "amount" : 9.99,
      "description" : "CHILI CHEESE DOG",
      "flags" : "",
      "qty" : 1,
      "remarks" : null,
      "unitPrice" : null
    }, {
      "amount" : 3.99,
      "description" : "VANILLA ICE CREAM",
      "flags" : "",
      "qty" : 1,
      "remarks" : null,
      "unitPrice" : null
    }, {
      "amount" : 2.99,
      "description" : "LARGE SODA",
      "flags" : "",
      "qty" : 1,
      "remarks" : null,
      "unitPrice" : null
    }, {
      "amount" : 5.99,
      "description" : "FRENCH FRIES",
      "flags" : "",
      "qty" : 1,
      "remarks" : null,
      "unitPrice" : null
    } ],
    "currency" : "USD",
    "total" : 56.64,
    "subtotal" : 51.94,
    "tax" : 4.70,
    "service_charge" : null,
    "tip" : null,
    "payment_method" : null,
    "payment_details" : null,
    "credit_card_type" : null,
    "credit_card_number" : null,
    "ocr_text" : "           THE TREEHOUSE\n        459 LAGUNITA DRIVE\n             STANFORD\n            5204708051\n      ORDER: 920\n           EAT IN\n HOST: HENRY\n 03/21/2022                  16:53\n QTY      ITEM               PRICE\n 1 CHEESE PIZZA            $ 12.99\n 1 CHEESEBURGER            $ 15.99\n 1 CHILI CHEESE DOG         $ 9.99\n 1 VANILLA ICE CREAM        $ 3.99\n 1 LARGE SODA               $ 2.99\n 1 FRENCH FRIES             $ 5.99\n VISA 9924                    SALE\n SUBTOTAL                  $ 51.94\n TAX                        $ 4.70\n TOTAL:                    $ 56.64\n TRANSACTION TYPE:            SALE\n AUTHORIZATION:           APPROVED\n PAYMENT CODE:            88471013\n PAYMENT ID:             274707603\n CARD READER:          SWIPED/CHIP\n       + TIP:\n         = TOTAL:\n X\n            CUSTOMER COPY\n        THANKS FOR VISITING\n            THE TREEHOUSE",
    "ocr_confidence" : 96.47,
    "width" : 643,
    "height" : 2193,
    "avg_char_width" : null,
    "avg_line_height" : null,
    "source_locations" : {
      "date" : [ [ {
        "y" : 589,
        "x" : 70
      }, {
        "y" : 589,
        "x" : 282
      }, {
        "y" : 613,
        "x" : 282
      }, {
        "y" : 613,
        "x" : 70
      } ] ],
      "total" : [ [ {
        "y" : 1392,
        "x" : 580
      }, {
        "y" : 1392,
        "x" : 722
      }, {
        "y" : 1416,
        "x" : 722
      }, {
        "y" : 1416,
        "x" : 580
      } ] ],
      "receipt_no" : [ [ {
        "y" : 321,
        "x" : 483
      }, {
        "y" : 321,
        "x" : 612
      }, {
        "y" : 374,
        "x" : 612
      }, {
        "y" : 374,
        "x" : 483
      } ] ],
      "subtotal" : [ [ {
        "y" : 1308,
        "x" : 580
      }, {
        "y" : 1308,
        "x" : 722
      }, {
        "y" : 1330,
        "x" : 722
      }, {
        "y" : 1330,
        "x" : 580
      } ] ],
      "doc" : [ [ {
        "y" : -17,
        "x" : 45
      }, {
        "y" : -17,
        "x" : 753
      }, {
        "y" : 2394,
        "x" : 753
      }, {
        "y" : 2394,
        "x" : 45
      } ] ],
      "merchant_name" : [ [ {
        "y" : 90,
        "x" : 261
      }, {
        "y" : 90,
        "x" : 536
      }, {
        "y" : 117,
        "x" : 536
      }, {
        "y" : 117,
        "x" : 261
      } ] ],
      "tax" : [ [ {
        "y" : 1350,
        "x" : 600
      }, {
        "y" : 1351,
        "x" : 721
      }, {
        "y" : 1373,
        "x" : 721
      }, {
        "y" : 1372,
        "x" : 600
      } ] ]
    }
  } ]
}

function OCR() {
  const [name, setName] = useState("");
  const location = useLocation();
  const [show, setModal] = useState(false)
  const [percent, changePercent] = useState(0);
  const [amount, changeAmount] = useState(0);
  const [receiptId, setId] = useState('');
  // const { from } = location.state;
  // // let from = jsonfile;
  // let jsonfile = from;
  function componentDidMount() {
    let file_name = jsonfile.file_name;
    let itemsarray = jsonfile.receipts[0].items;
    let items = [];
    for (const element of itemsarray) {
      let item_name = element.description;
      let price = element.amount;
      let qty = 1;
      if (element.qty) {
        qty = element.qty;
      }
      let item = {"item_name": item_name, "price": price, "qty": qty};
      items.push(item);
      }
      let location = jsonfile.receipts[0].merchant_name;
      let subtotal = jsonfile.receipts[0].subtotal;
      let tax = jsonfile.receipts[0].tax;
      let tip = 0;
      // will need user input for this
      if (jsonfile.receipts[0].tip) {
      tip = jsonfile.receipts[0].tip;
      }
    db.collection("receipts").add({
      date_time: jsonfile.receipts[0].date,
      file_name: file_name,
      items: items,
      location: location,
      subtotal: subtotal,
      tax: tax,
      tip: tip,
      users: {}
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        setId(docRef.id);
        db.collection('receipts').doc(docRef.id).update({
          'uid': `${docRef.id}`
          
        });
        setName(docRef.id);

      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

  }
  useEffect(() => {
    componentDidMount();
  }, []);
  function handleCloseModal() {
    let tip = amount;
    if (percent !== 0) {
      if (percent < 1) {
        tip = percent * (jsonfile.receipts[0].subtotal + jsonfile.receipts[0].tax);
      } else {
        tip = percent * (jsonfile.receipts[0].subtotal + jsonfile.receipts[0].tax) / 100;
      }
    }
    console.log(receiptId);
    db.collection('receipts').doc(receiptId).update({
      'tip' : tip
    });
    setModal(false);
  }
  // function handlePercent() {
  //   if(amount !== 0) {
  //     set
  //   }
  // }
  return (
    <div>
      <div className="content">
          <h1>
              Split.io
          </h1>
      </div>
        {/* <Card> */}
          {jsonfile.receipts[0].tip === 0 ?
          <></> : 
          <div style={{justifyContent: 'center'}}>
            <br/>
            <br/>
            <br/>
            <br/>
            <h3>Looks like you haven't tipped. Click bellow to add a tip for your bill.</h3>
          <Grid container justifyContent="center">
            <br/>
            <br/>
            <Button style={{ marginTop: "30px", display: "flex", flexDirection: "column" }} onClick={() => {setModal(true)}} >Tip</Button>
          </Grid>
          </div>
          }
          <Modal
            isOpen={show}
            ariaHideApp={false}
            contentLabel="Minimal Modal Example"
          >
            {/* <ExitToAppIcon onClick={() => {handleCloseModal();}} /> */}
            {/* <Button></Button> */}
            <TextField label='Tip Percentage' placeholder='Enter a percent' value={percent}
                                    onChange={(event) => {changePercent(event.target.value)}} fullWidth/>
            <TextField label='Tip Amount' placeholder='Enter an amount' value={amount}
                        onChange={(event) => {changeAmount(event.target.value)}} fullWidth/>
            <Button fullWidth onClick={() => {handleCloseModal();}}>Done</Button>
          </Modal>
          <Link to='/select1' state={{from: name}}>
            <Grid container justifyContent="center">
              <br/>
              <br/>
              <Button style={{ marginTop: "30px", display: "flex", flexDirection: "column" }}>Start Splitting!</Button>
            </Grid>
          </ Link>

        {/* </Card> */}
      </div>

  )

}

export default OCR;

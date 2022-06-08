import React, { Component, useEffect } from 'react';
// import { Button } from 'react-native-web';
import { auth, db } from '../firebase';
import { Card, CardHeader, CardActionArea, CardMedia, Grid, CardActions, Button, Typography, TextField } from '@material-ui/core';
import { Link } from 'react-router-dom';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Box, IconButton } from '@mui/material'
// import * as fs from 'fs';

// var fs = require('fs');
// var request = require('request');
// var receiptOcrEndpoint = 'https://ocr.asprise.com/api/v1/receipt';

class ReceiptUpload extends Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedImage: null
      }
    }
    componentDidMount() {

    }
    // readImageText() {
    //     let jsonfile;
    //     request.post({
    //         url: receiptOcrEndpoint,
    //         formData: {
    //             client_id: 'TEST',        // Use 'TEST' for testing purpose
    //             recognizer: 'auto',       // can be 'US', 'CA', 'JP', 'SG' or 'auto'
    //             ref_no: 'ocr_nodejs_123', // optional caller provided ref code
    //             file: fs.createReadStream(this.state.selectedImage) // the image file
    //         },
    //     }, function (error, response, body) {
    //         if (error) {
    //             console.error(error);
    //         }
    //         let data = body;
    //         console.log(body);
    //         jsonfile = JSON.parse(data)
    //         console.log(jsonfile);
    //         let file_name = jsonfile.file_name;
    //         let itemsarray = jsonfile.receipts[0].items;
    //         let items = [];
    //         for (const element of itemsarray) {
    //             let item_name = element.description;
    //             let price = element.amount;
    //             let qty = element.qty;
    //             let item = {"item_name": item_name, "price": price, "qty": qty};
    //             items.push(item);
    //         }
    //         let location = jsonfile.receipts[0].merchant_name
    //         let subtotal = jsonfile.receipts[0].subtotal
    //         let tax = jsonfile.receipts[0].tax
    //         db.collection("receipts").add({
    //             date_time: jsonfile.receipts[0].date,
    //             file_name: file_name,
    //             items: items,
    //             location: location,
    //             subtotal: subtotal,
    //             tax: tax,
    //             users: []
    //         })
    //         .then((docRef) => {
    //             console.log("Document written with ID: ", docRef.id);
    //             db.collection('receipts').doc(docRef.id).update({
    //                 'uid': `${docRef.id}`
    //             });
    //             this.setState({receipt: docRef.id});
    //         })
    //         .catch((error) => {
    //             console.error("Error adding document: ", error);
    //         });
    //         //console.log(JSON.parse(data));// Receipt OCR result in JSON
    //     });
    // }
    handleRemoveClicked() {
        this.setState({selectedImage: null});
    }

    render () {
        console.log(this.state.selectedImage);
      return (
        <div>
            {this.state.selectedImage && (
                <div>
                    <img style={{width: '40vh', height: '70vh'}} src={URL.createObjectURL(this.state.selectedImage)} alt="scanned file" />
                </div>
            )}
            <div>
                {this.state.selectedImage ?
                    <div className="button-container">
                        <button onClick={() => {this.readImageText();}}>Process the image with OCR</button>
                        <button
                            className="remove-button"
                            // disabled={ocrState === STATUSES.PENDING}
                            onClick={() => {this.handleRemoveClicked();}}
                        >
                            Use another image
                        </button>
                        <Link to= "/OCRInfo">
                        <button>Time to Split!</button>
                        </Link>

                    </div>
                    :
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <input accept="image/*" id="icon-button-file" type="file" hidden onChange={(event) => {
                                this.setState({selectedImage: event.target.files[0]});
                            }}/>
                        {/* <input accept="image/*" id="input" type="file" hidden onChange={(event) => {}}/> */}
                        <label htmlFor="icon-button-file">
                            <IconButton style={{display: 'flex', justifyContent: 'center'}} color="primary" component="span">
                                <PhotoCameraIcon />
                            </IconButton>
                        </label>
                    </Box>
                }
            </div>
            {/* <div className="status">
                {ocrState}
            </div> */}
            <br />
        </div>
      )
    }
  }
  export default ReceiptUpload;
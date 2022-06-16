import React, { Component} from 'react';
import { Link } from 'react-router-dom';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { Box, IconButton } from '@mui/material'

class ReceiptUpload extends Component {
    constructor(props) {
      super(props);
      this.state = {
        selectedImage: null
      }
    }
    componentDidMount() {

    }
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
            <br />
        </div>
      )
    }
  }
  export default ReceiptUpload;
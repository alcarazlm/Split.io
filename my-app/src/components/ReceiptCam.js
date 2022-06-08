import React, { useRef, useEffect, useState, Component} from "react";
import './ReceiptCam.css';
import { Link } from 'react-router-dom';
import canvasToImage from "canvas-to-image";
import { useWindowDimensions } from 'react-native';

 
function ReceiptCam(props) {
   const videoRef = useRef(null);
   const photoRef = useRef(null);
   const [hasPhoto, setHasPhoto] = useState(false);
   const { height1, width1 } = useWindowDimensions();

 
   const getVideo = () => {
       navigator.mediaDevices
           .getUserMedia({
               video: { width: width1, height: height1 }
           })
           .then(stream => {
               let video = videoRef.current;
               video.srcObject = stream;
 
               video.play();
           })
           .catch(err => {
               console.error(err);
           })
   }
 
 
   const takePhoto = () => {
       const width = 1920;
       const height = 1080;
 
       let video = videoRef.current;
       let photo = photoRef.current;
 
       photo.width = width;
       photo.height = height;
 
       const ctx = photo.getContext('2d');
       ctx.drawImage(video, 400, 0, width, height)
       const canvasEl = document.getElementById('myCanvas');
       canvasToImage(canvasEl, {
           name: 'myJPG',
           type: 'jpg',
           quality: 0.5
         });
       var target = new Image();
       target.src = canvasEl.toDataURL('image/jpeg');
       console.log(target.src);
       setHasPhoto(true);
   }
 
 
   const closePhoto = () => {
       let photo = photoRef.current;
       let ctx = photo.getContext('2d');
       console.log(ctx);
       ctx.clearRect(0, 400, photo.width, photo.height);
       setHasPhoto(false);
   }
 
 
   useEffect(() => {
       getVideo();
   }, [videoRef]);
 
   return (
 
       <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} >
           <div className="camera">
               <video ref={videoRef}></video>
               <Link to='/camera/done'>
                   <button onClick={takePhoto}>SNAP!</button>   
               </Link>
           </div>
           <div className={'result' + (hasPhoto ? 'hasPhoto' : '')} >
               <canvas id="myCanvas" ref={photoRef}></canvas>
               <button onClick={closePhoto}>CLOSE!</button>
           </div>
          
       </div >
   );
}
 
 
export default ReceiptCam;

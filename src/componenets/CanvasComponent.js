import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import img from '../frames/frame_0010.jpeg'
gsap.registerPlugin(ScrollTrigger);

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const frames = {
    currentIndex: 0,
    maxIndex: 382,
  };

  useEffect(() => {
    const preloadImages = () => {
      const imageArray = [];
      let imageload = 0;

      for (var i = 1; i <= frames.maxIndex; i++) {
        const imgUrl = `../frames/frame_${i.toString().padStart(4, '0')}.jpeg`; // Use the correct path
        const img = new Image();
        img.src = imgUrl;
        img.onload = () => {
          imageload++;
          if (imageload === frames.maxIndex) {
            loadImage(frames.currentIndex);
            startAnimation();
          }
          imageArray.push(img);
        };
        img.onerror = () => {
          console.error(`Failed to load image at ${imgUrl}`);
        };
      }

      setImages(imageArray);
    };

    const loadImage = (index) => {
      if (index >= 0 && index < frames.maxIndex && images[index]) {
        const img = images[index];
        const canvas = canvasRef.current;
        if (canvas) {
          const context = canvas.getContext('2d');
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          const scaleX = canvas.width / img.width;
          const scaleY = canvas.height / img.height;
          const scale = Math.max(scaleX, scaleY);
          const newWidth = img.width * scale;
          const newHeight = img.height * scale;
          const offsetX = (window.innerWidth - newWidth) / 2;
          const offsetY = (window.innerHeight - newHeight) / 2;

          context.clearRect(0, 0, canvas.width, canvas.height);
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = 'high';
          context.drawImage(img, offsetX, offsetY, newWidth, newHeight);
        }
      }
    };

    const startAnimation = () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: ".parent",
          start: "top top",
          scrub: 1,
        }
      }).to(frames, {
        currentIndex: frames.maxIndex,
        onUpdate: () => loadImage(Math.floor(frames.currentIndex))
      });
    };

    preloadImages();
  }, [images, frames]);

  return (
    <div className="container">
      <div className="parent">
        <div className="sticky-container">
          <canvas ref={canvasRef} className="canvas"></canvas>
        </div>
      </div>
   <img src={img}/>
    </div>
  );
};

export default CanvasComponent;

import React, { createRef, useEffect, useState } from 'react'

import Parent from "../../components/Parent";
import { Box } from "../../core/components";
import Header from '../students.ts.v1/Header';

import Firebase from "../../utils/Firebase";

const Comp: React.FC = () => {
  const storage = Firebase.app("storage-public").storage();
  const parent = createRef<Parent>();

  const [images, setImages] = useState<any>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const storageRef = storage.ref('admin')

    const fetchImages = async () => {

      let result = await storageRef.child('images').listAll();
      let urlPromises = result.items.map(imageRef => imageRef.getDownloadURL());

      return Promise.all(urlPromises);

    }

    const loadImages = async () => {
      const urls = await fetchImages();
      setImages(urls);
    }
    loadImages();
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => {
        return prev + 1 === images.length ? 0 : prev + 1;
      });
    }, 4000);
    return () => {
      clearInterval(intervalId);
    };
  }, [images]);

  const Slide = (props: any) => {

    return (
        <img src={props.image} alt="Sliderr_image" style={{
          position: "absolute", 
          maxHeight: "80vh"
        }} />
    );
  };
  return (
    <Parent ref={parent} >
      <Header
        onMenuClick={() => parent.current?.toggleMenu()}
        title="ยินดีต้อนรับเข้าสู่ระบบ"
      />
      <div>
        <Slide
          image={images[currentSlide]}
        />
      </div>
    </Parent>
  )
}

export default Comp
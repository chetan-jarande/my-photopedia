import React, { useRef, useEffect, useState } from "react";
import { tempDriveImgData, tempImgData } from "@/data/data";
import { CustomBtn9, CustomBtn16 } from "@/components/utilityComponent/buttons/CustomButtons";
import Image from "next/image";
import { capitalizeString } from "@/utils/utils";
import { motion } from "framer-motion";


const renderVerticalText = (text, isHovered) => {
  const letters = text.split("");
  // Variants for the letter animations
  const letterVariants = {
    hidden: (index) => ({
      y: Math.random() * 200 - 100, // Random starting position
      opacity: 0,
    }),
    visible: (index) => ({
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30,
        delay: index * 0.1, // Ensure this value is finite
      },
    }),
    exit: (index) => ({
      y: Math.random() * 200 - 100,
      opacity: 0,
      transition: {
        duration: 0.4,
      },
    }),
  };
  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-2">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            custom={index} // Pass index to the variant
            initial="hidden"
            animate={isHovered ? "visible" : "hidden"}
            exit="exit"
            variants={letterVariants}
            className={ `text-2xl font-bold ` 
              + "bg-gradient-to-br from-red-400 via-yellow-500 to-red-600 bg-clip-text text-transparent"
            }
            >
            {letter.toUpperCase()}
          </motion.span>
        ))}
    </div>
  );
};

const Card = ({ item, isVisible, idx }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
  <div
    className={`card item w-48 h-72 bg-center transition-transform transform duration-800 hover:scale-105 
      z-10 rounded-lg shadow-2xl m-2 flex items-center justify-center text-justify ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      key={`id_${item.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
    {/* Card Content */}
    <div className={"fixed h-full w-full"}>
      <Image
        src={item.imgOriginalLink}
        alt={item.imgOriginalLink}
        className="-z-20 block h-full w-full object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={"100"}
        fill
        // width={192}
        // height={288}
      />
    </div>
    <div className={`content inset-[50%] absolute flex justify-center items-center
                     transform -translate-y-1/2 text-white text-2xl font-bold`}>
      {/* TODO: Add responsiveness to below details , folderName, Desc  */}
      <div className="name ">
        {isHovered
          ? renderVerticalText(item.folderName, isHovered)
          : capitalizeString(item.folderName)}
      </div>
    </div>
  </div>
);}

const PhotoGallerySections = ({}) => {
    const [bgImage, setBgImage] = useState(tempDriveImgData[0]); // Background image
  const [sliderItems, setSliderItems] = useState(tempDriveImgData); // Slider items

  // Initialize the slider on first render
  useEffect(() => {
    if (tempDriveImgData.length > 1) {
      setBgImage(tempDriveImgData[0]); // Set first item as background
      setSliderItems([
        ...tempDriveImgData.slice(1), // Rotate first item to the end
        tempDriveImgData[0],
      ]);
    }
  }, []);

  // Update slider for "Right" button click
  const handleClickNext = () => {
    const updatedSlider = [...sliderItems];
    const shiftedItem = updatedSlider.shift(); // Remove the first element
    updatedSlider.push(shiftedItem); // Add it to the end
    setSliderItems(updatedSlider);
    setBgImage(updatedSlider.at(-1)); // Set new background .at(-1);
  };

  // Update slider for "Left" button click
  const handleClickPrev = () => {
    const updatedSlider = [...sliderItems];
    const lastItem = updatedSlider.pop(); // Remove the last element
    updatedSlider.unshift(lastItem); // Add it to the beginning
    setSliderItems(updatedSlider);
    setBgImage(updatedSlider.at(-1)); // Set new background
  };

  return (
    <div
      className={`relative w-full h-screen box-border border-none outline-none text-decoration-none list-none overflow-hidden
                  flex `}
      id="photo_section"
      >
      {/* Background Image */}
      <div className="absolute h-full w-full">
        <Image
          src={bgImage.imgOriginalLink}
          alt={bgImage.imgOriginalLink}
          className="-z-20 block h-full w-full object-cover"
          width={240}
          height={320}
          quality={"100"}
          priority
        />
      </div>
      
      {/* Image Description */}
      {/* TODO: Add responsiveness to below details , folderName, Desc  */}
      <div
        className={`content absolute w-full top-[30%] left-[5%] transform -translate-y-1/2 text-white flex flex-col items-start` }
        >
        <div className="name text-3xl font-bold">{capitalizeString(bgImage.folderName)}</div>
        <div className="desc text-base mt-4 font-medium">{bgImage.desc}</div>
        <CustomBtn16 ButtonName="See More" className="!font-normal hover:!font-semibold" />
        {/* <button className="px-4 py-2 mt-4 bg-white text-black rounded hover:bg-bac383 transition duration-300">
          See more
        </button> */}
      </div>

      {/* CardSlider */}
      <div
        id="slide"
        className="w-full top-1/2 left-[10%] absolute flex justify-end overflow-hidden"
      >
        {sliderItems.map((item, idx) => (
          <Card key={`${item.id}_${idx}`} item={item} isVisible={idx < 3} idx={idx}  />
        ))}
      </div>

      {/* Buttons */}
      <div className="my-4 bottom-8 z-50 w-full text-center absolute text-cyan-50">
        <button
          id="prev"
          onClick={handleClickPrev}
          className={`w-12 h-12 rounded-full border-2 border-cyan-400 transition duration-500 
                      hover:bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500`}
        >
          L
        </button>
        <button
          id="next"
          onClick={handleClickNext}
          className={`w-12 h-12 rounded-full border-2 border-cyan-400 transition duration-500 ml-4 
                      hover:bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500`}
        >
          R
        </button>
      </div>
    </div>
  );
};

export default PhotoGallerySections;

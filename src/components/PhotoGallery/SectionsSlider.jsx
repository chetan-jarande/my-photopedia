'use client'

import { useState } from 'react'
import Image from 'next/image'

import { Swiper, SwiperSlide } from "swiper/react";
import {
  FreeMode,
  Navigation,
  Thumbs,
  Pagination,
  Virtual,
  A11y,
  EffectCoverflow,
  EffectFade,
  Mousewheel, 
  Keyboard,
} from "swiper/modules";

import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import 'swiper/css/pagination'
import { tempImgData, tempDriveImgData } from '@/data/data'


// Requirements: https://swiperjs.com/demos

// Pagination dynamic : 
// pagination custom buttons  outside 
// slides should be Centered (auto)
// Infinite loop
// Autoplay (Autoplay progress)
//  Lazy load images

// Zoom for outer swiper (optional)


// cSpell:ignore Swiper


const SectionsSlider = () => {

  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const handleClickNext = () => {
    thumbsSwiper.slideNext();
  };

  const handleClickPrev = () => {
    thumbsSwiper.slidePrev();
  };

  return (
    <section className='min-h-screen bg-black py-12 relative'>
        <div className="relatives ">
          <Swiper
            loop={true}
            centeredSlides={true}
            allowTouchMove={false}
            // keyboard={true}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
            }}
            modules={[FreeMode, Thumbs, Virtual, EffectFade, Pagination]}
            className='h-screen w-full rounded-lg absolute -z-10 pointer-events-none'

            effect={'fade'}
            fadeEffect={{
              crossFade: true,
            }}
            pagination={{
              type: 'fraction',
            }}
          >
            {tempDriveImgData.map((image, index) => (
              <SwiperSlide key={index}>
                <div className='flex h-full w-full items-center justify-center'>
                  <Image
                    src={image.imgOriginalLink}
                    alt={image.imgOriginalLink}
                    className='block h-full w-full object-cover'
                    width={240}
                    height={320}
                  />

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Thumbnail cards */}
        {/* add  creative effects */}
        <div className="w-full bottom-[20%] absolute  ">
          <Swiper
            onSwiper={setThumbsSwiper}
            // loop={true}
            keyboard={true}
            mousewheel={true}
            grabCursor={true}
            freeMode={true}
            watchSlidesProgress={true}
            spaceBetween={12}
            centeredSlides={true}
            slidesPerView={2}
            breakpoints={{
              // when window width is >= 200px
              200: { slidesPerView: 1 },
              // when window width is >= 380px
              380: { slidesPerView: 2 },
              740: { slidesPerView: 3 },
              1275: { slidesPerView: 4 },
            }}
            // autoHeight={true}
            effect={'coverflow'}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            modules={[FreeMode, Navigation, Thumbs, A11y, EffectCoverflow, Mousewheel, Keyboard]}
            className='Thumbnail_cards  mt-3 h-52 w-full rounded-lg'
            
          >
            {tempDriveImgData.map((image, index) => (
              <>
                <SwiperSlide key={index}>
                  <button
                    className='flex h-full w-full items-center justify-center'
                    onClick={() => thumbsSwiper.slideTo(index)}
                  >
                    <Image
                      src={image.imgOriginalLink}
                      alt={image.imgOriginalLink}
                      className='block h-full w-full object-cover'
                      width={240}
                      height={320}
                    />
                  </button>
                </SwiperSlide>
              </>
            ))}

          </Swiper>
        </div>


      {/* Buttons  */}
      <div className={`swiper_buttons  absolute my-4 bottom-[5%] z-50 w-full text-center`}>
        <button
          id="prev"
          onClick={() => handleClickPrev()}
          className={"w-12 h-12 rounded-full border-2 border-gray-700 transition duration-500 bg-orange-400 " +
            "hover:bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 "}
        >
          L
        </button>
        <button
          id="next"
          onClick={() => handleClickNext()}
          className={"w-12 h-12 rounded-full border-2 border-gray-700 transition duration-500 ml-4 bg-orange-400 " +
            "hover:bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 "}
        >
          R
        </button>
      </div>

    </section>
  )
}

export default SectionsSlider
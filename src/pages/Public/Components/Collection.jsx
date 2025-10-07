import React from 'react';
import '../../../assets/css/style.scss';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Cloth1 from '../../../assets/img/cloth1.png';
import Cloth2 from '../../../assets/img/cloth2.png';
import WeekCollection from './WeekCollection';
import YearCollection from './YearCollection';
import Approach from './Approach';

export default function Collection() {
    const images = [Cloth1, Cloth2, Cloth1, Cloth2];

    return (
        <>
            <div className='collection'>
                <div className="first-sec flex">
                    <div className="collection-side">
                        <div className='collection-head'>
                            <ul>
                                <li>MEN</li>
                                <li>WOMAN</li>
                                <li>KIDS</li>
                            </ul>
                            <div className='collection-search'>
                                <input placeholder='Search' />
                                <i></i>
                            </div>
                        </div>
                        <div className='collection-text'>
                            <h1>NEW<br />COLLECTION</h1>
                            <p>
                                Summer<br />2024
                            </p>
                        </div>
                        <div className='collection-bottom'>
                            <button>Go To Shop <i></i></button>
                            <div className='latest-pagination'>
                                {/* className='none-active' */}
                                <div className='prev'><IoIosArrowBack /></div>
                                <div className='next'><IoIosArrowForward /></div>
                            </div>
                        </div>
                    </div>
                    <div className="collection-latest">
                        <div className='h-[139px]'></div>
                        <Swiper
                            modules={[Navigation]}
                            navigation={{
                                nextEl: '.next',
                                prevEl: '.prev',
                            }}
                            slidesPerView={3}
                            loop={true}
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img src={image} alt={`Cloth ${index + 1}`} style={{ width: '366px', height: '376px' }} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
                <WeekCollection />
                <YearCollection />
                <Approach />
            </div>
        </>
    )
}
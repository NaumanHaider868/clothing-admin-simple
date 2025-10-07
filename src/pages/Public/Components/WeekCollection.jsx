import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import Cloth4 from '../../../assets/img/cloth4.png';
import Cloth5 from '../../../assets/img/cloth5.png';
import Cloth6 from '../../../assets/img/cloth6.png';
import Cloth7 from '../../../assets/img/cloth7.png';
import Cloth8 from '../../../assets/img/cloth8.png';
import Cloth2 from '../../../assets/img/cloth2.png';

import { GoPlus } from 'react-icons/go';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function WeekCollection() {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const products = [
        { id: 1, img: Cloth7, type: "V-Neck T-Shirt", name: "Embroidered Seersucker Shirt", price: "$99" },
        { id: 2, img: Cloth8, type: "Cotton T-Shirt", name: "Basic Slim Fit T-Shirt", price: "$120" },
        { id: 3, img: Cloth5, type: "Henley T-Shirt", name: "Blurred Print T-Shirt", price: "$70" },
        { id: 4, img: Cloth6, type: "Crewneck T-Shirt", name: "Full Sleeve Zipper", price: "$89" },
        { id: 5, img: Cloth2, type: "V-Neck T-Shirt", name: "Embroidered Seersucker Shirt", price: "$99" },
        { id: 6, img: Cloth4, type: "V-Neck T-Shirt", name: "Embroidered Seersucker Shirt", price: "$99" },
    ];

    return (
        <div className="pt-[100px] week-collection">
            <div className="head flex justify-between items-end pr-[52px]">
                <div className="heading">
                    <h1>NEW <br /> THIS WEEK</h1>
                    <p>(50)</p>
                </div>
                <a className='!text-[16px] text-[#8A8A8A] float-right pt-[45px] cursor-pointer hover:underline'>View All</a>
            </div>

            <Swiper
                slidesPerView={3}
                spaceBetween={40}
                navigation={{
                    nextEl: '.next',
                    prevEl: '.prev',
                }}
                modules={[Navigation]}
                className="products !pt-[30px] !pr-[52px]"
                onInit={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
                onSlideChange={(swiper) => {
                    setIsBeginning(swiper.isBeginning);
                    setIsEnd(swiper.isEnd);
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} style={{ width: '302px' }} className="product">
                        <div className="img relative">
                            <img src={product.img} alt={product.name} className="w-full" />
                            <span className="absolute bottom-0 bg-[#dcdcdc9c] w-[34px] h-[34px] right-[45%] flex items-center justify-center cursor-pointer">
                                <GoPlus className="text-white text-[20px]" />
                            </span>
                        </div>
                        <div className="details pt-[14px]">
                            <span className="type text-[#525252] text-[12px]">{product.type}</span>
                            <div className="detail flex justify-between">
                                <span className="text-[14px]">{product.name}</span>
                                <span className="price text-[14px]">{product.price}</span>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                <div className='latest-pagination flex justify-center items-center gap-[20px] pt-[30px]'>
                    <div
                        className={`prev w-[45px] h-[48px] flex items-center justify-center border border-[#a5a5a5] ${isBeginning ? 'opacity-50' : 'cursor-pointer'}`}
                        disabled={isBeginning}
                    >
                        <IoIosArrowBack className='text-[24px]' />
                    </div>
                    <div
                        className={`next w-[45px] h-[48px] flex items-center justify-center border border-[#a5a5a5] ${isEnd ? 'opacity-50' : 'cursor-pointer'}`}
                        disabled={isEnd}
                    >
                        <IoIosArrowForward className='text-[24px]' />
                    </div>
                </div>
            </Swiper>
        </div>
    );
}

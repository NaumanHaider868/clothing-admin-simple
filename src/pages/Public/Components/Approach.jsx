import React from 'react'
import image from '../../../assets/img/men3.png'
import image1 from '../../../assets/img/men11.png'
import image2 from '../../../assets/img/men12.png'
import image3 from '../../../assets/img/men14.png'

export default function Approach() {
    return (
        <div className='pt-[150px] approach'>
            <div className='heading flex flex-col items-center text-center pr-[52px]'>
                <h1 className='text-[48px] tracking-[2px] leading-[40px]'>
                    OUR APPROACH TO FASHION DESIN
                </h1>
                <p className='text-[16px] pt-[10px] font-extralight max-w-[49rem]'>at elegant vogue, we blend creativity with craftsmanship to create fashion that transcends trends and stands the test of time. Each design is meticulously crafted, ensuring the highest quality exquisite finish.</p>
            </div>
            <div className="content pt-[100px]">
                <div className='flex items-center justify-between'>
                    <img src={image} className='w-[293px] h-[389px]' />
                    <img src={image1} className='w-[293px] h-[389px] mt-[100px]' />
                    <img src={image2} className='w-[293px] h-[389px]' />
                    <img src={image3} className='w-[293px] h-[389px] mt-[100px]' />
                </div>
            </div>
        </div>
    )
}

import React from 'react'
import { GoPlus } from 'react-icons/go';
import Cloth4 from '../../../assets/img/cloth4.png';
import Cloth6 from '../../../assets/img/cloth6.png';
import Cloth2 from '../../../assets/img/cloth2.png';

export default function YearCollection() {
    const products = [
        { id: 1, img: Cloth6, type: "Crewneck T-Shirt", name: "Full Sleeve Zipper", price: "$89" },
        { id: 2, img: Cloth2, type: "V-Neck T-Shirt", name: "Embroidered Seersucker Shirt", price: "$99" },
        { id: 3, img: Cloth4, type: "V-Neck T-Shirt", name: "Embroidered Seersucker Shirt", price: "$99" },
    ];
    return (
        <div className='pt-[100px] year-collections pr-[52px]'>
            <div className='collection-head'>
                <h1 className='text-[48px] font-bold leading-[40px] tracking-[2px]'>XIV<br />COLLECTIONS<br />23-24</h1>
                <div className='collection-accordion'>
                    <ul>
                        <li className='active'>(All)</li>
                        <li>Men</li>
                        <li>Women</li>
                        <li>KID</li>
                    </ul>
                    <div className="sort">
                        <p>Sort(-)</p>
                        <span className='text-[#8A8A8A]'>Less to more</span>
                        <br />
                        <span className='text-[#8A8A8A]'>More to less</span>
                    </div>
                </div>
            </div>
            <div className="products pt-[30px] flex justify-between">
                {products.map((product) => (
                    <div className="product w-[366px]">
                        <div className="img relative">
                            <img src={product.img} alt={product.name} className="w-full object-cover" />
                            <span className="absolute bottom-0 bg-[#dcdcdc9c] right-[45%] flex items-center justify-center cursor-pointer">
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
                    </div>
                ))}
            </div>

            <a className='text-[#8A8A8A] float-right pt-[45px] cursor-pointer hover:underline'>View All</a>
        </div>
    )
}

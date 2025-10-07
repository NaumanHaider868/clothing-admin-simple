import React from 'react';
import Img1 from '../../../assets/img/men11.png';
import Img2 from '../../../assets/img/men12.png';
import Img3 from '../../../assets/img/men13.png';
import Filter from './Filter';

const categories = ["SHIRTS", "POLO SHIRTS", "BEST SELLERS", "T-SHIRTS", "JEANS", "SHORTS", "JACKETS"];
const products = [
    { img: Img1, type: "Cotton T Shirt", name: "Full Sleeve Zipper", price: "$ 99" },
    { img: Img2, type: "Cotton T Shirt", name: "Full Sleeve Zipper", price: "$ 99" },
    { img: Img3, type: "Cotton T Shirt", name: "Full Sleeve Zipper", price: "$ 99" },
];

export default function Products() {
    return (
        <div className="products flex pt-[65px] pr-[52px]">
            <div>
                <div className="product-nav">
                    <div className="right">
                        <div className="path">
                            <span className="text-[#6F6F6F] text-[12px] tracking-[2px]">Home</span> /
                            <span className="text-[12px] tracking-[2px]">Products</span>
                        </div>
                        <div className="action">
                            <h6 className="text-[20px] py-[8px] font-bold">PRODUCTS</h6>
                            <input type="text" placeholder="Search" />
                            <i></i>
                        </div>
                    </div>
                    <div className="left">
                        <button className="active">NEW</button>
                        {categories.map(category => (
                            <button key={category}>{category}</button>
                        ))}
                    </div>
                </div>
                <div className="content pt-[50px] flex justify-between">
                    {products.map((product, index) => (
                        <div key={index} className="product w-[286px]">
                            <div className="img relative">
                                <img src={product.img} className="w-full object-contain h-[427px]" alt={product.name} />
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
            </div>
            <div className='product-sidebar'>
                <Filter />
            </div>
        </div>
    );
}

import React from 'react';
import Footer from './Footer';
import arrowLeftLong from '../../../assets/img/actions/big-arrow-left.png';
import Image from '../../../assets/img/product1.png';
import Image2 from '../../../assets/img/men23.png';

const ProductItem = ({ imgSrc, title, price, colorSize, count }) => (
    <div className="item">
        <div className="img cursor-pointer">
            <img src={imgSrc} className="w-full h-full" alt={title} />
        </div>
        <div className="content">
            <div className="detail">
                <div className="flex justify-between">
                    <span className="title">{title}</span>
                    <span className="price">{price}</span>
                </div>
                <span className="color-size">{colorSize}</span>
            </div>
            <div className="action flex justify-between">
                <span className="count">({count})</span>
                <a className="link">Change</a>
            </div>
        </div>
    </div>
);

export default function Checkout() {
    return (
        <>
            <div className="main-section h-auto overflow-hidden">
                <div className="w-full">
                    <section className="flex h-full">
                        <div className="checkout">
                            <div className="header">
                                <img src={arrowLeftLong} className="cursor-pointer" alt="Back" />
                            </div>
                            <div className="content">
                                <div className="content-head">
                                    <div className="head">
                                        <h1>CHECKOUT</h1>
                                    </div>
                                    <div className="according">
                                        <ul>
                                            <li className="active">INFORMATION</li>
                                            <li>SHIPPING</li>
                                            <li>PAYMENT</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="content-main">
                                    <div className="left">
                                        <div className="contact">
                                            <label>CONTACT INFO</label>
                                            <input type="email" className="input" placeholder="Email" />
                                            <input type="phone" className="input" placeholder="Phone" />
                                        </div>
                                        <div className="shipping">
                                            <label>SHIPPING ADDRESS</label>
                                            <div className="flex gap-3">
                                                <input type="text" placeholder="First Name" />
                                                <input type="text" placeholder="Last Name" />
                                            </div>
                                            <select>
                                                <option value="Pakistan">Pakistan</option>
                                                <option value="India">India</option>
                                                <option value="Bangladesh">Bangladesh</option>
                                            </select>
                                            <input type="text" placeholder="State/Region" />
                                            <input type="text" placeholder="Address" />
                                            <div className="flex gap-3">
                                                <input type="text" placeholder="City" />
                                                <input type="text" placeholder="Postal Code" />
                                            </div>
                                        </div>
                                        <div className="order">
                                            <div className="w-full"></div>
                                            <button>
                                                Shipping <i className="icon"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="flex justify-end">
                                            <span className="like w-[34px] h-[34px] bg-white text-[#000E8A] text-[16px] font-semibold flex items-center justify-center">
                                                ( 2 )
                                            </span>
                                        </div>
                                        <div className="products">
                                            <h4 className="head">YOUR ORDER</h4>
                                            <div className="mt-[20px] flex flex-col gap-5">
                                                <ProductItem
                                                    imgSrc={Image}
                                                    title="Basic Heavy T-Shirt"
                                                    price="$99"
                                                    colorSize="Black / Large"
                                                    count="1"
                                                />
                                                <ProductItem
                                                    imgSrc={Image2}
                                                    title="Basic Heavy T-Shirt"
                                                    price="$99"
                                                    colorSize="Black / Large"
                                                    count="1"
                                                />
                                            </div>
                                            <div className='sub-total'>
                                                <div className="total">
                                                    <span>Subtotal</span>
                                                    <span>$180.00</span>
                                                </div>
                                                <div className="shipping">
                                                    <span>Shipping</span>
                                                    <span className='next'>Calculated at next step</span>
                                                </div>
                                            </div>
                                            <div className="total">
                                                <span>Total</span>
                                                <span>$180.00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}
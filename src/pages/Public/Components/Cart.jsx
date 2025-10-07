import React from 'react'
import Image1 from '../../../assets/img/product1.png'
import Image2 from '../../../assets/img/men23.png'
import { IoMdClose } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { IoRemoveOutline } from "react-icons/io5";

export default function Cart() {
    return (
        <div className='cart pt-[65px] pr-[52px]'>
            <div className="cart-head">
                <ul>
                    <li className='active'>SHOPPING BAG</li>
                    <li>FAVOURITES</li>
                </ul>
            </div>
            <div className='flex justify-between'>
                <div className="left">
                    <div className='products'>
                        <div className="product">
                            <div className='detail'>
                                <div className="image">
                                    <img src={Image1} />
                                    <span>Cotton T Shirt</span>
                                </div>
                                <div className='price'>
                                    <span>Full Sleeve Zipper</span>
                                    <span>$ 99</span>
                                </div>
                            </div>
                            <div className="action">
                                <div className="close">
                                    <IoMdClose />
                                </div>
                                <div className='flex flex-col gap-[20px] mt-20'>
                                    <div className='size'>
                                        <span>L</span>
                                    </div>
                                    <div className="color bg-black"></div>
                                    <div className="add-remove">
                                        <div className="add"><GoPlus /></div>
                                        <div className="num text-[20px]">1</div>
                                        <div className="remove"><IoRemoveOutline /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="product">
                            <div className='detail'>
                                <div className="image">
                                    <img src={Image2} />
                                    <span>Cotton T Shirt</span>
                                </div>
                                <div className='price'>
                                    <span>Full Sleeve Zipper</span>
                                    <span>$ 99</span>
                                </div>
                            </div>
                            <div className="action">
                                <div className="close">
                                    <IoMdClose />
                                </div>
                                <div className='flex flex-col gap-[20px] mt-20'>
                                    <div className='size'>
                                        <span>L</span>
                                    </div>
                                    <div className="color bg-black"></div>
                                    <div className="add-remove">
                                        <div className="add"><GoPlus /></div>
                                        <div className="num text-[20px]">1</div>
                                        <div className="remove"><IoRemoveOutline /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="head">
                        <span className='text-[18px]'>ORDER SUMMARY</span>
                    </div>
                    <div className='pt-[20px] pb-[20px] border-b-2 border-[#D9D9D9]'>
                        <div className="flex justify-between">
                            <span className='font-semibold'>Subtotal</span>
                            <span className='font-semibold'>$ 180</span>
                        </div>
                        <div className="flex justify-between mt-[5px]">
                            <span className='font-semibold'>Shipping</span>
                            <span className='font-semibold'>$ 10</span>
                        </div>
                        <div className=""></div>
                    </div>
                    <div className='pt-[30px]'>
                        <div className="flex justify-between">
                            <span className='font-semibold flex items-baseline'>TOTAL &nbsp; <p className='text-[#6E6E6E] text-[10px]'>(TAX INCL.)</p></span>
                            <span className='font-semibold'>$ 190</span>
                        </div>
                    </div>
                    <div className='pt-[30px]'>
                        <div className='flex gap-[10px]'>
                            <input type="checkbox" />
                            <p className='text-[13px]'>I agree to the Terms and Conditions</p>
                        </div>
                    </div>
                    <button className='bg-[#D9D9D9] w-full pt-[10px] pb-[10px] mt-[18px]'>CONTINUE</button>
                </div>
            </div>
        </div>
    )
}

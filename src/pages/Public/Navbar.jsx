import React from 'react'
import '../../assets/css/style.scss'

export default function Navbar() {
    return (
        <div className='navbar pr-[52px]'>
            <div className='flex justify-between items-center'>
                <div className='option-l flex justify-between items-center'>
                    <ul className='web-option'>
                        {/* <li className='action'><span></span></li> */}
                        <li>Home</li>
                        <li>Collections</li>
                        <li>New</li>
                    </ul>
                </div>
                <div className='logo'><span></span></div>
                <div className='option-r flex justify-between items-center'>
                    <ul className='user-option'>
                        <li className='like'><span></span></li>
                        <li className='cart'>
                            <div className='cart-text'><span>Cart</span></div>
                            <span className='cart-icon'><i></i></span>
                        </li>
                        <li className='user'><span></span></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

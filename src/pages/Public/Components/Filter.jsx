import React, { useState } from 'react';
import { IoIosArrowForward, IoIosArrowUp } from 'react-icons/io';
import { Range } from 'react-range';

export default function Filter() {
    const [openSections, setOpenSections] = useState([]);
    const [priceRange, setPriceRange] = useState([50, 1000]); // Default price range

    const colors = ['black', 'red', 'green', 'yellow', 'brown', 'blue', 'purple'];
    const productTypes = [
        'Shorts',
        'Trousers',
        'Cotton Shirt',
        'Polo Shirt',
        'T-Shirt',
        'Outerwear',
        'Jeans',
        'Sweatshirts',
        'Jacket',
    ];
    const seasons = ['Summer', 'Winter', 'Spring', 'Autumn'];

    const toggleSection = (section) => {
        if (openSections.includes(section)) {
            setOpenSections(openSections.filter((s) => s !== section));
        } else {
            setOpenSections([...openSections, section]);
        }
    };

    return (
        <div className="sidebar">
            <span className="text-[16px] font-medium">Filters</span>

            {/* Sizes */}
            <div className="sizes">
                <span>Size</span>
                <div className="size flex gap-2 mt-2">
                    {['XS', 'S', 'M', 'L', 'XL', '2X'].map((size) => (
                        <div key={size} className="px-3 py-1 border text-center cursor-pointer">
                            {size}
                        </div>
                    ))}
                </div>
            </div>

            {/* Accordions */}
            <div className="accordions w-full max-w-sm mx-auto mt-5">
                {/* Availability */}
                <div className="accordion">
                    <button
                        className="w-full text-left py-3 flex justify-between items-center"
                        onClick={() => toggleSection('availability')}
                    >
                        <span className="font-semibold">Availability</span>
                        <span>
                            {openSections.includes('availability') ? <IoIosArrowUp /> : <IoIosArrowForward />}
                        </span>
                    </button>
                    {openSections.includes('availability') && (
                        <div className="pb-3 pl-4">
                            {['In Stock (450)', 'Out Of Stock (18)'].map((label) => (
                                <label key={label} className="flex items-center space-x-2">
                                    <input type="checkbox" />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Colors */}
                <div className="accordion">
                    <button
                        className="w-full text-left py-3 flex justify-between items-center"
                        onClick={() => toggleSection('colors')}
                    >
                        <span className="font-semibold">Colors</span>
                        <span>
                            {openSections.includes('colors') ? <IoIosArrowUp /> : <IoIosArrowForward />}
                        </span>
                    </button>
                    {openSections.includes('colors') && (
                        <div className="pb-3 pl-4 flex gap-2 flex-wrap">
                            {colors.map((color) => (
                                <label key={color} className="flex items-center cursor-pointer">
                                    <input type="checkbox" className="hidden" />
                                    <div
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            backgroundColor: color,
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                        }}
                                    ></div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Range */}
                <div className="accordion">
                    <button
                        className="w-full text-left py-3 flex justify-between items-center"
                        onClick={() => toggleSection('price')}
                    >
                        <span className="font-semibold">Price Range</span>
                        <span>
                            {openSections.includes('price') ? <IoIosArrowUp /> : <IoIosArrowForward />}
                        </span>
                    </button>
                    {openSections.includes('price') && (
                        <div className="pb-3 pl-4">
                            <div className="relative">
                                <Range
                                    values={priceRange}
                                    step={10}
                                    min={50}
                                    max={1000}
                                    onChange={(range) => setPriceRange(range)}
                                    renderTrack={({ props, children }) => (
                                        <div
                                            {...props}
                                            className="w-full h-2 bg-gray-300 rounded-lg"
                                        >
                                            {children}
                                        </div>
                                    )}
                                    renderThumb={({ props }) => (
                                        <div
                                            {...props}
                                            className="w-5 h-5 bg-blue-400 rounded-full shadow-md"
                                        />
                                    )}
                                />
                            </div>
                            <div className="text-center mt-2">
                                <p className="text-sm text-gray-600">Selected Price Range:</p>
                                <p className="text-lg font-semibold">
                                    ${priceRange[0]} - ${priceRange[1]}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Product Type */}
                {/* <div className="accordion">
                    <button
                        className="w-full text-left py-3 flex justify-between items-center"
                        onClick={() => toggleSection('productType')}
                    >
                        <span className="font-semibold">Product Type</span>
                        <span>
                            {openSections.includes('productType') ? <IoIosArrowUp /> : <IoIosArrowForward />}
                        </span>
                    </button>
                    {openSections.includes('productType') && (
                        <div className="pb-3 pl-4 product-btns">
                            {productTypes.map((type) => (
                                <button
                                    key={type}
                                    className="px-3 py-1 border rounded cursor-pointer hover:bg-gray-200"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    )}
                </div> */}

                {/* Seasons */}
                <div className="accordion">
                    <button
                        className="w-full text-left py-3 flex justify-between items-center"
                        onClick={() => toggleSection('seasons')}
                    >
                        <span className="font-semibold">Seasons</span>
                        <span>
                            {openSections.includes('seasons') ? <IoIosArrowUp /> : <IoIosArrowForward />}
                        </span>
                    </button>
                    {openSections.includes('seasons') && (
                        <div className="product-btns pb-3 pl-4 ">
                            {seasons.map((season) => (
                                <button key={season}>
                                    {season}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

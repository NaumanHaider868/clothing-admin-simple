import React, { useRef, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdZoomOut, MdZoomIn, MdFitScreen } from "react-icons/md";
import { useParams } from "react-router-dom";
import { api } from "../../../../utlis/customAPI";
import { useQuery } from "@tanstack/react-query";
import ErrorHandler from "../../../../utlis/common";
import ViewProductSkeleton from "../../../../utlis/shimmar/viewProduct";

function ViewProduct() {
    const { id } = useParams()
    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["product", id],
        queryFn: async () => {
            const response = await api.get(`/product/fetch/${id}`);
            return response.data;
        },
        enabled: !!id,
    });

    const containerRef = useRef(null);
    const imageRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");

    const [zoomLevel, setZoomLevel] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

    const product = data?.data;

    const productImages = product?.variants?.[selectedVariant]?.images?.map(img => img.imageUrl) || [];

    const availableSizes = product?.variants?.[selectedVariant]?.sizes || [];

    const originalPrice = parseFloat(product?.price || 0);
    const discountPercent = parseFloat(product?.discountPercent || 0);
    const discountedPrice = product?.onSale
        ? originalPrice - (originalPrice * discountPercent / 100)
        : originalPrice;

    useEffect(() => {
        if (isLoading || !containerRef.current) return;

        const container = containerRef.current;

        const updateProgress = () => {
            const scrollPosition = container.scrollTop;
            const progressPercentage = ((scrollPosition + container.clientHeight) / container.scrollHeight) * 100;
            setProgress(Math.min(progressPercentage, 100));
        };

        const calculateInitialProgress = () => {
            const firstImage = container.querySelector("img");
            if (firstImage && container.scrollHeight > 0) {
                const progressValue = (firstImage.clientHeight / container.scrollHeight) * 100;
                setProgress(Math.min(progressValue, 100));
            }
        };

        const timer = setTimeout(() => {
            calculateInitialProgress();
        }, 300);

        container.addEventListener("scroll", updateProgress);

        return () => {
            clearTimeout(timer);
            container.removeEventListener("scroll", updateProgress);
        };
    }, [isLoading, imagesLoaded]);

    const handleImageLoad = () => {
        setImagesLoaded(true);
    };

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setIsOpen(true);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    const closeLightbox = () => {
        setIsOpen(false);
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    const moveNext = () => {
        if (currentImageIndex < productImages.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        } else {
            setCurrentImageIndex(0);
        }
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    const movePrev = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        } else {
            setCurrentImageIndex(productImages.length - 1);
        }
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    const zoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.25, 5));
        setPosition({ x: 0, y: 0 });
    };

    const zoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.25, 0.1));
        setPosition({ x: 0, y: 0 });
    };

    const resetZoom = () => {
        setZoomLevel(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e) => {
        if (zoomLevel > 1) {
            setIsDragging(true);
            setStartPosition({
                x: e.clientX - position.x,
                y: e.clientY - position.y
            });
        }
    };

    const handleMouseMove = (e) => {
        if (isDragging && zoomLevel > 1) {
            const newX = e.clientX - startPosition.x;
            const newY = e.clientY - startPosition.y;

            const maxX = (zoomLevel - 1) * 100;
            const maxY = (zoomLevel - 1) * 100;

            setPosition({
                x: Math.max(Math.min(newX, maxX), -maxX),
                y: Math.max(Math.min(newY, maxY), -maxY)
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                moveNext();
            } else if (e.key === 'ArrowLeft') {
                movePrev();
            } else if (e.key === '+') {
                zoomIn();
            } else if (e.key === '-') {
                zoomOut();
            } else if (e.key === '0') {
                resetZoom();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentImageIndex, productImages.length]);

    const handleVariantSelect = (index) => {
        setSelectedVariant(index);
        setSelectedSize("");
    };

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    if (isLoading) {
        return(
            <div>
                <ViewProductSkeleton/>
            </div>
        )
    }

    if (isError) {
        return (
            <ErrorHandler
                error={error}
                message="Unable to load product"
                handleReFetch={refetch}
            />
        );
    }

    return (
        <div className="view-product">
            <div className="relative product-img">
                <div className="left" ref={containerRef}>
                    {productImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${product?.name} ${index + 1}`}
                            onClick={() => openLightbox(index)}
                            onLoad={handleImageLoad}
                            className="product-image cursor-zoom-in"
                        />
                    ))}
                </div>
                <div className="progress-bar" style={{ height: `${progress}%` }} />
            </div>
            <div className="right">
                <div className="product-detail mt-[10px]">
                    <div className="top">
                        <span className="heading font-[monospace] text-[18px]">{product?.name}</span>
                        <div className="price-section font-[monospace] text-[24px] flex items-center mt-2 mb-1">
                            {product?.onSale && (
                                <span className="original-price line-through text-gray-500 mr-2">
                                    ${originalPrice.toFixed(2)}
                                </span>
                            )}
                            <span className="price">${discountedPrice.toFixed(2)}</span>
                            {product?.onSale && (
                                <span className="discount-badge bg-red-500 text-white text-xs px-2 py-1 rounded ml-2">
                                    {discountPercent}% OFF
                                </span>
                            )}
                        </div>
                        <span className="tax font-[monospace] mt-3 font-semibold">
                            MRP incl. of all taxes
                        </span>
                        {product?.collection && (
                            <span className="collection text-sm text-gray-800 mt-3 block font-[monospace] text-[16px] font-semibold">
                                Collection: {product.collection}
                            </span>
                        )}
                    </div>
                    <div className="desc">
                        <span>{product?.description}</span>
                        {product?.modelDetail && (
                            <div className="model-detail text-sm text-gray-500 mt-2 font-[monospace]">
                                {product.modelDetail}
                            </div>
                        )}
                    </div>
                    <div className="bottom">
                        <div className="colors">
                            <span className="!font-[monospace] font-semibold text-[16px] text-black">Color:</span>
                            <div className="detail">
                                {product?.variants?.map((variant, index) => (
                                    <div
                                        key={variant.id}
                                        className={`color ${selectedVariant === index ? 'ring-2 ring-black-500' : ''} rounded-full w-6 h-6`}
                                        style={{ backgroundColor: variant.color }}
                                        onClick={() => handleVariantSelect(index)}
                                        title={`Color: ${variant.color}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="sizes">
                            <span className="text-[16px] text-black font-semibold font-[monospace]">
                                Size:
                            </span>
                            <div className="detail">
                                {availableSizes.map((sizeObj) => (
                                    <div
                                        key={sizeObj.id}
                                        className={`size ${selectedSize === sizeObj.size ? 'text-black font-semibold' : ''} !font-[monospace]`}
                                        onClick={() => handleSizeSelect(sizeObj.size)}
                                    >
                                        {sizeObj.size}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <span className="font-[monospace] pt-4 block cursor-pointer">FIND YOUR SIZE | MEASUREMENT GUIDE</span>

                        {!product?.inStock && (
                            <div className="out-of-stock text-red-500 font-medium mb-4">
                                Out of Stock
                            </div>
                        )}

                        <button
                            className={`product-add ${!product?.inStock || !selectedSize ? 'opacity-50 cursor-not-allowed' : ''} font-[monospace] text-white bg-black w-full py-3 mt-4 rounded-md hover:bg-gray-800 transition-all text-[16px]`}
                            disabled={!product?.inStock || !selectedSize}
                        >
                            {!product?.inStock ? 'Out of stock' : !selectedSize ? 'Select Size' : 'Add To Cart'}
                        </button>

                        <div className="additional-info mt-6 space-y-2 text-sm text-gray-600 font-[monospace]">
                            <div className="flex justify-between">
                                <span>Gender:</span>
                                <span className="capitalize">{product?.gender}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Collection Type:</span>
                                <span className="capitalize">{product?.collectionType}</span>
                            </div>
                            {product?.type && (
                                <div className="flex justify-between">
                                    <span>Type:</span>
                                    <span>{product.type}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 text-white text-2xl z-10 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                        onClick={closeLightbox}
                    >
                        <IoClose size={28} />
                    </button>

                    {productImages.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={movePrev}
                                disabled={productImages.length <= 1}
                            >
                                <IoIosArrowBack size={28} />
                            </button>
                            <button
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-2xl z-10 hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={moveNext}
                                disabled={productImages.length <= 1}
                            >
                                <IoIosArrowForward size={28} />
                            </button>
                        </>
                    )}

                    <div className="absolute top-4 left-4 text-white text-sm z-10">
                        {currentImageIndex + 1} / {productImages.length}
                    </div>

                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black bg-opacity-50 rounded-lg p-2 z-10">
                        <button
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-all disabled:opacity-50"
                            onClick={zoomOut}
                            disabled={zoomLevel <= 0.1}
                        >
                            <MdZoomOut size={20} />
                        </button>

                        <button
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-all disabled:opacity-50"
                            onClick={zoomIn}
                            disabled={zoomLevel >= 5}
                        >
                            <MdZoomIn size={20} />
                        </button>

                        <button
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-all"
                            onClick={resetZoom}
                        >
                            <MdFitScreen size={20} />
                        </button>
                    </div>

                    <div className="max-w-4xl max-h-[80vh] flex items-center justify-center overflow-hidden">
                        <img
                            ref={imageRef}
                            src={productImages[currentImageIndex]}
                            alt={`${product?.name} ${currentImageIndex + 1}`}
                            className="max-w-full max-h-[80vh] object-contain transition-transform duration-200 ease-out cursor-move"
                            style={{
                                transform: `scale(${zoomLevel}) translate(${position.x}px, ${position.y}px)`,
                                transformOrigin: 'center center'
                            }}
                            onMouseDown={handleMouseDown}
                        />
                    </div>

                    {productImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                            {productImages.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                        }`}
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        setZoomLevel(1);
                                        setPosition({ x: 0, y: 0 });
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    <div className="absolute bottom-4 right-4 text-white text-xs bg-black bg-opacity-50 px-3 py-1 rounded z-10">
                        Use mouse wheel to zoom • Drag to pan • Press 0 to reset
                    </div>
                </div>
            )}
        </div>
    );
}

export { ViewProduct };
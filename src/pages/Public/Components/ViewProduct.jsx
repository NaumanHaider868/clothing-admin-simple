import React, { useRef, useEffect, useState } from "react";
import Image1 from "../../../assets/img/product1.png";
import Image2 from "../../../assets/img/product2.png";
import Image3 from "../../../assets/img/product3.png";
import "react-image-lightbox/style.css";
import Lightbox from "react-image-lightbox";
import { CiHeart } from "react-icons/ci";

const images = [Image1, Image2, Image3];

export default function ViewProduct() {
    const containerRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const container = containerRef.current;

        const updateProgress = () => {
            const scrollPosition = container.scrollTop;
            const maxScroll = container.scrollHeight - container.clientHeight;
            const progressPercentage = ((scrollPosition + container.clientHeight) / container.scrollHeight) * 100;
            setProgress(progressPercentage);
        };

        const calculateInitialProgress = () => {
            const firstImageHeight = container?.querySelector("img")?.clientHeight || 0;
            if (container.scrollHeight > 0) {
                setProgress((firstImageHeight / container.scrollHeight) * 100);
            }
        };

        calculateInitialProgress();
        container.addEventListener("scroll", updateProgress);

        return () => container.removeEventListener("scroll", updateProgress);
    }, []);

    const openLightbox = (index) => {
        setCurrentImageIndex(index);
        setIsOpen(true);
    };

    const closeLightbox = () => setIsOpen(false);

    const moveNext = () => {
        if (currentImageIndex < images.length - 1) {
            setCurrentImageIndex((currentImageIndex + 1) % images.length);
        }
    };

    const movePrev = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex((currentImageIndex + images.length - 1) % images.length);
        }
    };

    return (
        <div className="view-product">
            <div className="relative product-img">
                <div className="left" ref={containerRef}>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Product ${index + 1}`}
                            onClick={() => openLightbox(index)}
                        />
                    ))}
                </div>
                <div className="progress-bar" style={{ height: `${progress}%` }} />
            </div>
            <div className="right">
                <div className="flex justify-end">
                    <span className="like w-[34px] h-[34px] bg-white flex items-center justify-center">
                        <CiHeart className="text-[24px]" />
                    </span>
                </div>
                <div className="product-detail">
                    <div className="top">
                        <span className="heading">ABSTRACT PRINT SHIRT</span>
                        <span className="price">$99</span>
                        <span className="tax">
                            MRP incl. of all taxes
                        </span>
                    </div>
                    <div className="desc">
                        <span>
                            Relaxed-fit shirt. Camp collar and short seleevs. Button-up front.
                        </span>
                    </div>
                    <div className="bottom">
                        <div className="colors">
                            <span>Color</span>
                            <div className="detail">
                                <div className="color bg-[#B9C1E8]"></div>
                                <div className="color bg-[#ffc65c]"></div>
                                <div className="color bg-[#1E1E1E]"></div>
                                <div className="color bg-[#A9A9A9]"></div>
                                <div className="color bg-[#D9D9D9]"></div>
                                <div className="color bg-[#A6D6CA]"></div>
                            </div>
                        </div>
                        <div className="sizes">
                            <span>Size</span>
                            <div className="detail">
                                {['XS', 'S', 'M', 'L', 'XL', '2X'].map((size) => (
                                    <div key={size} className="size">
                                        {size}
                                    </div>
                                ))}
                            </div>
                            <span className="size-text">FIND YOUR SIZE | MEASUREMENT GUIDE</span>
                        </div>
                        <button className="product-add">ADD</button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <Lightbox
                    mainSrc={images[currentImageIndex]}
                    nextSrc={currentImageIndex < images.length - 1 ? images[currentImageIndex + 1] : null}
                    prevSrc={currentImageIndex > 0 ? images[currentImageIndex - 1] : null}
                    onCloseRequest={closeLightbox}
                    onMovePrevRequest={movePrev}
                    onMoveNextRequest={moveNext}
                    nextLabel={currentImageIndex < images.length - 1 ? "Next" : undefined}
                    prevLabel={currentImageIndex > 0 ? "Previous" : undefined}
                    nextSrcDisabled={currentImageIndex >= images.length - 1}
                    prevSrcDisabled={currentImageIndex <= 0}
                />
            )}
        </div>
    );
}

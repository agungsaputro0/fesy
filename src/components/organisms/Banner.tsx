import React from 'react';
import Slider from 'react-slick';

interface CarouselProps {
  images: string[];
}

const Banner: React.FC<CarouselProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="carousel-slide">
            <div className="image-wrapper">
              <img className="banner_image" src={image} alt={`Banner ${index + 1}`} />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;


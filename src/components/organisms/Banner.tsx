import React from 'react';
import Slider from 'react-slick';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notification } from "antd";

interface CarouselProps {
  images: string[];
  texts?: { title: string; description: string }[];
}

const defaultTexts = [
  { title: "Temukan Gaya Baru di Fesy", description: "Jual, beli, dan tukar pakaian bekas berkualitas!" },
  { title: "Fashion Berkelanjutan", description: "Dukung gerakan zero waste dengan fashion yang lebih ramah lingkungan." },
  { title: "Gaya Unik, Harga Terjangkau", description: "Dapatkan pakaian berkualitas dengan harga yang lebih hemat." }
];

const Banner: React.FC<CarouselProps> = ({ images, texts = defaultTexts }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000
  };

  const navigate = useNavigate();

  const goToMarketPlace = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) {
      notification.info({message: "Hai Sahabat Fesy",  description: "Silakan Login terlebih dahulu ya!",})
      navigate("/Login");
    } else {
      navigate(`/Market`);
    }
  }

  return (
    <div className="w-full mx-auto mb-6 sm:mb-8">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden"
          >
            <img 
              className="w-full h-full object-cover" 
              src={image} 
              alt={`Banner ${index + 1}`} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-center items-center text-white text-center px-6 sm:px-12">
              <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg">{texts[index]?.title || defaultTexts[index % defaultTexts.length].title}</h2>
              <p className="text-sm sm:text-lg md:text-xl drop-shadow-md mt-2">{texts[index]?.description || defaultTexts[index % defaultTexts.length].description}</p>
              <button 
                className="mt-4 px-6 py-3 bg-[#7f0353] text-white font-semibold rounded-full hover:bg-[#990866] transition flex items-center gap-2 shadow-lg" 
                onClick={() => goToMarketPlace()}
              >
                <ShoppingBag size={20} /> Jelajahi Sekarang
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;

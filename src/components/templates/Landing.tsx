import Button from "../atoms/Button";
import { useNavigate } from "react-router-dom";
import Banner from "../organisms/Banner";


const LandingLayouts = () => {
    const navigate = useNavigate();

    const images = [
        '../../../assets/img/banner-1.jpg',
        '../../../assets/img/banner-2.jpg',
        '../../../assets/img/banner-3.jpg',
      ];

    return (
        <div className="pt-[65px] pb-10 flex flex-col justify-between items-center min-h-screen">
            <div className="w-full">
                <div className="custom-slider-container">
                    <Banner images={images} />
                </div>
            </div>
        </div>
    );
}

export default LandingLayouts;

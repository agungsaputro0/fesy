import Banner from "../organisms/Banner";
import PopularSection from "../organisms/PopularSection";
import OurCommitment from "../molecules/OurCommitment";
import OurAchievements from "../molecules/Achievements";
import TabSection from "../organisms/TabSection";

const LandingLayouts = () => {

    const images = [
        '../../../assets/img/banner-1.jpg',
        '../../../assets/img/banner-2.jpg',
        '../../../assets/img/banner-3.jpg',
      ];

    return (
        <div className="pt-[65px] flex flex-col justify-between items-center min-h-screen">
            <div className="w-full">
                <div className="custom-slider-container">
                    <Banner images={images} />
                    <PopularSection />
                    <TabSection />
                    <OurCommitment />
                    <OurAchievements />
                </div>
            </div>
        </div>
    );
}

export default LandingLayouts;

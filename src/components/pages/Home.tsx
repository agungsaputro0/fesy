import Homeshell from "../shell/HomeShell";
import PopularSection from "../organisms/PopularSection";
import OurCommitment from "../molecules/OurCommitment";
import OurAchievements from "../molecules/Achievements";
import TabSection from "../organisms/TabSection";
import Banner from "../organisms/Banner";
import Footer from "../organisms/Footer";

const Home = () => {
    const images = [
        '../../../assets/img/banner-1.jpg',
        '../../../assets/img/banner-2.jpg',
        '../../../assets/img/banner-3.jpg',
      ];
    return (
            <Homeshell>
                <div className="pt-[65px] pb-10 flex flex-col justify-between items-center min-h-screen">
                    <div className="w-full">
                        <div className="custom-slider-container">
                            <Banner images={images} />
                        </div>
                    </div>
                </div>
                <PopularSection />
                <TabSection />
                <OurCommitment />
                <OurAchievements />
                <Footer />
            </Homeshell>
    )
}

export default Home;
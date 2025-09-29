import ImageSlider from "./ImageSlider";
import { sliderImages } from "../data/sliderImages";
import { useUi } from "../context/UiContext";

export default function Hero() {
  const { setCurrentSection } = useUi();
  const onCta = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    setCurrentSection("products");
  };
  return (
    <section className="hero" id="home">
      <ImageSlider
        images={sliderImages}
        autoPlay
        interval={10000}
        onCta={onCta}
      />
    </section>
  );
}

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ImageCarousel = ({ images }) => {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 3000 }} // 3 sec interval
      pagination={{ clickable: true }}
      loop={true}
      className="w-80 md:w-[80%] h-40 md:h-70 rounded-lg shadow-lg"
    >
      {images.map((img, index) => (
        <SwiperSlide key={index} className="aspect-video">
          <img src={img} alt={`Slide ${index}`} className="w-full h-full object-fill object-center rounded-lg" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;

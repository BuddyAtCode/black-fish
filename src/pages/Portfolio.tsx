import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ReactLenis } from "lenis/react";
import { Link } from "react-router-dom";
import headerImage from "../assets/Images/BlackFish_header.svg"
const ImageComponent = (props: any) => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  const ml = (width / 12) * props.ml;
  const mt = (height / 8) * props.mt;
  useEffect(() => {
    console.log(props.x);
  }, [props.x]);
  return (
    <motion.div
      className="flex"
      style={{
        height: (height / 8) * props.height,
        width: (width / 12) * props.width,
        marginLeft: ml,
        marginTop: mt,
        backgroundImage: `url("/images/IMG_${props.index}.jpg")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        x: props.x,
        y: props.y,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        opacity: {
          delay: 0.3,
          duration: 1,
        },
        x: {
          duration: 0.1,
          delay: 0.001,
        },
      }}
    />
  );
};
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = React.useState({
    x: null,
    y: null,
  });

  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return mousePosition;
};
function Portfolio() {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const mousePosition = useMousePosition();
  const stringPos = JSON.stringify(mousePosition);
  useEffect(() => {
    const x = mousePosition.x;
    const y = mousePosition.y;
    x ? setMouseX(x) : null;
    y ? setMouseY(y) : null;
    console.log(mouseX);
  }, [stringPos]);

  const calculateParalax = (
    position: any,
    maxDistance: any,
    factor: number
  ) => {
    return (position - maxDistance / 1000) * factor;
  };
  const height = window.innerHeight;
  const width = window.innerWidth;
  const ml = (width / 12) * 2;

  const arr = [0,1,2,3,4,5,6,7]
  return (
    <ReactLenis root>
      <section className="w-screen h-screen relative">
        <div className="w-full h-full absolute  flex items-center justify-center">
          <motion.div
            className="w-[61%] h-[61%]
           fixed z-40"
            style={{
              backgroundImage: `url(${headerImage})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              x: calculateParalax(mouseX, window.innerWidth, -0.02),
              y: calculateParalax(mouseY, window.innerHeight, -0.02),
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          />
          <Link to={"/"} className="w-96 h-96 z-50 " />
        </div>

        <motion.div
          style={{
            width: width,
            height: height,
            //backgroundImage: `url(${tatooGuyImage})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            x: calculateParalax(mouseX, window.innerWidth, 0.05),
            y: calculateParalax(mouseY, window.innerHeight, 0.05),
          }}
          initial={{ height: (height / 8) * 6, width: width, marginLeft: 0 }}
          animate={{
            height: (height / 8) * 2,
            width: (width / 12) * 2,
            marginLeft: ml,
          }}
          transition={{ duration: 1 }}
        />

        <div className="w-full h-full  grid grid-cols-12 grid-rows-8 ">
         
          <ImageComponent
            width={3}
            height={2}
            ml={8}
            mt={-2}
            index={4}
            x={calculateParalax(mouseX, window.innerWidth, 0.03)}
            y={calculateParalax(mouseY, window.innerWidth, 0.02)}
          />
          <ImageComponent
            width={2}
            height={1}
            ml={6}
            mt={5}
            index={1}
            x={calculateParalax(mouseX, window.innerWidth, 0.08)}
            y={calculateParalax(mouseY, window.innerWidth, 0.01)}
          />
          <ImageComponent
            width={4}
            height={3}
            ml={6}
            index={2}
            x={calculateParalax(mouseX, window.innerWidth, 0.04)}
            y={calculateParalax(mouseY, window.innerWidth, 0.03)}
          />
          <ImageComponent
            width={2}
            height={2}
            ml={-3}
            mt={3}
            index={0}
            x={calculateParalax(mouseX, window.innerWidth, 0.12)}
            y={calculateParalax(mouseY, window.innerWidth, 0.02)}
          />
        <ImageComponent
            width={2}
            height={2}
            ml={-3}
            mt={3}
            index={3}
            x={calculateParalax(mouseX, window.innerWidth, 0.04)}
            y={calculateParalax(mouseY, window.innerWidth, 0.06)}
          />
           <ImageComponent
            width={2}
            height={2}
            ml={-3}
            mt={3}
            index={5}
            x={calculateParalax(mouseX, window.innerWidth, 0.05)}
            y={calculateParalax(mouseY, window.innerWidth, 0.01)}
          />
           <ImageComponent
            width={2}
            height={2}
            ml={-3}
            mt={3}
            index={7}
            x={calculateParalax(mouseX, window.innerWidth, 0.08)}
            y={calculateParalax(mouseY, window.innerWidth, 0.08)}
          />
          
        </div>
      </section>
    </ReactLenis>
  );
}

export default Portfolio;

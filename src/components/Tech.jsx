import React from "react";
import { BallCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

const Tech = () => {
  return (
    <>
      {/* This div will be hidden on mobile devices */}
      <div className='hidden md:flex flex-row flex-wrap justify-center gap-10 '>
        {technologies.map((technology) => (
          <div className='w-28 h-28' key={technology.name}>
            <BallCanvas icon={technology.icon} />
          </div>
        ))}
      </div>
      
      {/* This div will be shown only on mobile devices */}
      <div className='max-[640px]:flex hidden'>
        {/* Add content here for mobile devices */}
        <p>This is content for mobile devices</p>
      </div>
    </>
  );
};

export default SectionWrapper(Tech, "");

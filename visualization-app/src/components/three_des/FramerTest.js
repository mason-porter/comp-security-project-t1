import React, {useState} from "react";
import { motion } from "framer-motion";

function FramerTest(){
  const [move, setMove] = React.useState(false);
  return (
      <motion.div
        animate={{ x: move ? "90%" : 0 }}
        transition={{ type: "tween", duration: 1.5}}
        onClick={()=> {
          console.log(!move);
          setMove(!move);
        }}
      ><div className="cell" /></motion.div>
  )
}

export default FramerTest;
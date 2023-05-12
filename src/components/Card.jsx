import React, { useState } from 'react';

import CardModal from './CardModal';
import { motion } from 'framer-motion';

const Card = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className='margin-card'>
      <div onClick={() => { setIsOpen(true) }}>
        <motion.img className="thumb" src={props.src} alt={props.title}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />
        {/* <p>{props.title}</p> */}
      </div>
      <CardModal open={isOpen} close={() => { setIsOpen(false) }} imageName={props.imageName} fitHeight={props.fitHeight}>
      </CardModal>

    </div>
  )
}

export default Card;
///*require("../../assets/" + props.thumbName)*/
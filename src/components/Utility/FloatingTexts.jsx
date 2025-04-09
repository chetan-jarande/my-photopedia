import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const defaultImgPath =  "../../../public/images/others/header-bg.jpg" 
// Default values for the component
const defaultTextData = [
  "welcome  to",
  "my  photopidia",
  // 'photography', 
  // 'club'
];

// Utility function to generate a random position
const getRandomPosition = () => ({
  x: Math.floor(Math.random() * 600) - 300, // Random x from -300 to 300
  y: Math.floor(Math.random() * 600) - 300, // Random y from -300 to 300
});

const FloatingTexts = ({ 
  textData = defaultTextData, 
  imgUrl=defaultImgPath, 
  textUpper = true,
  wordSpace="space-x-4"
}) => {
  
  const rows = textData.map(word => word.split(''));
  // Animation variants for container and each letter
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const letterVariants = {
    hidden: ({ x, y }) => ({
      x,
      y,
      opacity: 0,
    }),
    visible: {
      x: 1,
      y: 1,
      opacity: 1,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  return (
    <div className="absolute w-full  top-1/2 -left-1/4 z-50 flex justify-center items-center bg-cover bg-center" 
         style={{ backgroundImage: `url('${imgUrl}')` }}>
      <div className="relative inset-0 from-black/60 to-black/20" />

      <motion.div
        className="text-center text-5xl font-semibold"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Map over each row of letters */}
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex justify-center ${wordSpace} mb-4`}> 
            {row.map((letter, letterIndex) => (
              <motion.span
                key={letterIndex}
                custom={getRandomPosition()}
                variants={letterVariants}
                className="inline-block"
              >
                { textUpper ? letter.toUpperCase() : letter }
              </motion.span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// Define prop types for validation
FloatingTexts.propTypes = {
  textData: PropTypes.arrayOf(PropTypes.string),
};

export default FloatingTexts;

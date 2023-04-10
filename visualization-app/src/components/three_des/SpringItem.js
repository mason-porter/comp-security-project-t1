import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

function Matrix({ m, n, t, size }) {
  // Create an array of numbers from 0 to (m x n) - 1
  const numbers = Array.from({ length: m * n }, (_, i) => i);

  // Create a state variable to keep track of the positions of each element
  const [positions, setPositions] = useState(
    numbers.map((number) => ({
      x: (number % n) * size,
      y: Math.floor(number / n) * size
    }))
  );

  // Define a function to swap the positions of two elements
  function swapPositions(i, j) {
    setPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      const temp = newPositions[i];
      newPositions[i] = newPositions[j];
      newPositions[j] = temp;
      return newPositions;
    });
  }

  // Define a function to create an animated style object for each element
  function getStyle(index) {
    const { x, y } = positions[index];
    return useSpring({
      to: {
        x,
        y
      },
      config: { duration: 200 }
    });
  }

  // Define a function to randomly swap two elements every t seconds
  function startTimer() {
    setInterval(() => {
      const i = Math.floor(Math.random() * numbers.length);
      let j = Math.floor(Math.random() * (numbers.length - 1));
      if (j >= i) {
        j++;
      }
      swapPositions(i, j);
    }, t * 1000);
  }

  // Call the startTimer function to start the timer when the component mounts
  React.useEffect(() => {
    startTimer();
  }, []);

  // Render a grid of animated circles with the corresponding style object for each element
  return (
    <svg width={n * size} height={m * size}>
      {numbers.map((number) => {
        const { x, y } = positions[number];
        return (
          <animated.circle
            key={number}
            cx={x + size / 2}
            cy={y + size / 2}
            r={size / 2}
            style={getStyle(number)}
          />
        );
      })}
    </svg>
  );
}

export default Matrix;

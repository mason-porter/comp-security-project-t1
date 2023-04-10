import React, { useState, useEffect } from 'react';
import { useSprings, animated } from 'react-spring';

function Matrix1({ rows, cols, size, t }) {
  const [matrix, setMatrix] = useState(createMatrix(rows, cols));
  const springs = useSprings(
    rows * cols,
    matrix.map((_, index) => ({
      x: index % cols * size,
      y: Math.floor(index / cols) * size,
      from: { x: index % cols * size, y: Math.floor(index / cols) * size },
      config: { duration: t / 2 },
    })),
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const [a, b] = getRandomIndices(matrix.length);
      swapPositions(a, b);
    }, t);
    return () => clearInterval(intervalId);
  }, [matrix, t]);

  function createMatrix(rows, cols) {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        matrix.push({ row: i, col: j });
      }
    }
    return matrix;
  }

  function getRandomIndices(n) {
    const a = Math.floor(Math.random() * n);
    let b = Math.floor(Math.random() * (n - 1));
    if (b >= a) b++;
    return [a, b];
  }

  function swapPositions(a, b) {
    const temp = matrix[a];
    matrix[a] = matrix[b];
    matrix[b] = temp;
    setMatrix([...matrix]);
  }

  function handleClick(index){
    console.log(index);
  }

  return (
    <div style={{ position: 'relative', width: cols * size, height: rows * size }}>
      {springs.map(({ x, y }, index) => (
        <animated.div
          key={index}
          style={{
            position: 'absolute',
            top: y,
            left: x,
            width: size,
            height: size,
            background: 'lightblue',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => handleClick(index)}
        >
          {matrix[index].row},{matrix[index].col}
        </animated.div>
      ))}
    </div>
  );
}

export default Matrix1;

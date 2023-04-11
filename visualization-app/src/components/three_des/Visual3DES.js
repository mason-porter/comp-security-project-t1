import React, {useState} from "react";
import { motion } from "framer-motion";

function Visual3DES(){
  const cellSize = 34;
  const durSpeed = 1;
  const [animating,setAnimating] = useState(false);
  const [done,setDone] = useState(false);
  const [t1,setT1] = useState("");
  const [inpX, setInpX] = useState(Array.from({length: 8}, () => Array(8).fill(-1)));
  const [showIP,setShowIP] = useState(false);
  const [permInp, setPermInp] = useState(Array.from({length: 8}, () => Array(8).fill(false)));
  const [showPInp,setShowPInp] = useState(false);

  const ip = [[57, 49, 41, 33, 25, 17, 9,  1],
              [59, 51, 43, 35, 27, 19, 11, 3],
              [61, 53, 45, 37, 29, 21, 13, 5],
              [63, 55, 47, 39, 31, 23, 15, 7],
              [56, 48, 40, 32, 24, 16, 8,  0],
              [58, 50, 42, 34, 26, 18, 10, 2],
              [60, 52, 44, 36, 28, 20, 12, 4],
              [62, 54, 46, 38, 30, 22, 14, 6]]

  function charToAscii(char) {
    return char.charCodeAt(0);
  }

  function wordToAscii(){
    let textInput = document.getElementById("wordtext");
    let text = textInput.value;
    let i = 0;
    while(i<8){
      const element = document.getElementById("n"+i);
      element.value = (text[i]!==undefined) ? charToAscii(text[i]) : 0;
      i += 1;
    }
  }

  function decimalToBinary(decimal) {
    var binaryString = decimal.toString(2);
    while (binaryString.length < 8) {
      binaryString = "0" + binaryString;
    }
    return binaryString;
  }

  function visualEncrypt(){
    if(animating == true || done == true){
      console.log("Resetting Animation");
      reset();
      setTimeout(() => {
        animate();
      }, durSpeed * 2000);
    }
    else{
      animate();
    }
  }

  function animate(){
    console.log("Starting Animation");
    setAnimating(true);
    console.log("Getting input X");
    getInpX();
    setTimeout(() => {
      console.log("Displaying IP Matrix");
      setShowIP(true);
      setTimeout(() => {
        console.log("Permutating Input");
        getPermInp();
        setShowPInp(true);
        setTimeout(() => {
          console.log("Done animating!");
          setAnimating(false);
          setDone(true);
        }, durSpeed * 2000);
      }, durSpeed * 2000);
    }, durSpeed * 2000);
  }

  function reset(){
    setDone(false);
    setT1("");
    setShowIP(false);
    resInpX();
    setShowPInp(false);
    resPermInp();
  }

  function resInpX(){ // Reset initial Input
    const newInpX = [...inpX];
    for(let i = 0; i<8; i++){
      for(let j = 0; j<8; j++){
        newInpX[i][j] = -1;
      }
    }
    setInpX(newInpX);
  }

  function getInpX(){ // Get initial Input
    const newInpX = [...inpX];
    for(let i = 0; i<8; i++){
      let val = parseInt(document.getElementById("n"+i).value);
      val = (val > 255)? 255 : (val < 0)? 0 : val;
      const bText = decimalToBinary(val);
      for(let j = 0; j<8; j++){
        newInpX[i][j] = parseInt(bText[j]);
      }
    }
    setT1("Input Block (64-bits)");
    setInpX(newInpX);
  }

  function resPermInp(){ // Reset IP matrix
    const newPermInp = [...permInp];
    for(let i = 0; i<8; i++){
      for(let j = 0; j<8; j++){
        newPermInp[i][j] = false;
      }
    }
    setPermInp(newPermInp);
  }

  function getPermInp(){
    const newPermInp = [...permInp];
    for(let i = 0; i<8; i++){
      for(let j = 0; j<8; j++){
        newPermInp[i][j] = true;
      }
    }
    setPermInp(newPermInp);
  }

  return (
    <div>
      <div className="input-3des">
        <label >Enter Input:</label>
        <input className="nInput" type="text" id="wordtext" name="wordtext" maxLength="8"></input>
        <button className="nInput" onClick={() => wordToAscii()}>To ASCII</button>
        <input className="nInput" type="number" id="n0" name="num0" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n1" name="num1" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n2" name="num2" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n3" name="num3" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n4" name="num4" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n5" name="num5" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n6" name="num6" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n7" name="num7" min="0" max="255" defaultValue={0}/>
        <button className="nInput" onClick={() => visualEncrypt()}>Encypt</button>
      </div>

      <div>
        {inpX.map((row, i) => (
          <div key={i}>
          {row.map((cell, j) => (
            <motion.div
              key={i+","+j}
              initial={{ opacity: (inpX[i][j]==-1)? 0 : 1.0 }}
              animate={{ x: (permInp[i][j]==false)? cellSize * (j+1) : cellSize * (ip[i][j]%8+19), 
                         y: (permInp[i][j]==false)? cellSize * (i+1) : cellSize * (Math.floor(ip[i][j]/8)+1),
                         opacity: (inpX[i][j]==-1)? 0 : 1.0 }}
              transition={{ type: "tween", duration: durSpeed * 1.5}}
              id={"Inp{"+i+"}{"+j+"}"}
              onClick={(e)=> {
                console.log(e.id);
              }}
              ><div className="cell">{inpX[i][j]==-1? "":inpX[i][j]}</div>
            </motion.div>
          ))}
          </div>
        ))}
        <motion.div
        initial={{ opacity: (showPInp==true)? 1.0 : 0.0,
                  x: cellSize*23 - 63,
                  y:  cellSize*9 }}
        animate={{ opacity: (showPInp==true)? 1.0 : 0.0 }}
        transition={{ type: "tween", duration: durSpeed * 1.5}}
        id="tIP">
        <div className="aInput">Permutated Input</div>
        </motion.div>
      </div>
      <div>
        {ip.map((row, i) => (
          <div key={"ip-row"+i}>
          {row.map((cell, j) => (
            <motion.div
              key={"ip("+i+","+j+")"}
              initial={{ opacity: (showIP==true)? 1.0 : 0,
                         x: cellSize * (j+10), 
                         y: cellSize * (i+1), }}
              animate={{ opacity: (showIP==true)? 1.0 : 0 }}
              transition={{ type: "tween", duration: durSpeed * 1.5}}
              id={"Inp{"+i+"}{"+j+"}"}
              ><div className="cell">{ip[i][j]}</div>
            </motion.div>
          ))}
          </div>
        ))}
        <motion.div
        initial={{ opacity: (showIP==true)? 1.0 : 0.0,
                  x: cellSize*14 - 88,
                  y:  cellSize*9 }}
        animate={{ opacity: (showIP==true)? 1.0 : 0.0 }}
        transition={{ type: "tween", duration: durSpeed * 1.5}}
        id="tIP">
        <div className="aInput">Initial Permuation Matrix</div>
        </motion.div>
      </div>
      <div>
      <motion.div
        initial={{ opacity: (t1=="")? 0.0 : 1.0,
                  x: (t1 == "Input Block (64-bits)")? cellSize*5 - 75 : 200,
                  y: (t1 == "Input Block (64-bits)")? cellSize*9 : 200 }}
        animate={{ x: (t1 == "Input Block (64-bits)")? cellSize*5 - 75 : 200,
                   y: (t1 == "Input Block (64-bits)")? cellSize*9 : 200,
                   opacity: (t1=="")? 0.0 : 1.0 }}
        transition={{ type: "tween", duration: durSpeed * 1.5}}
        id="t1">
        <div className="aInput">{t1}</div>
      </motion.div>
      </div>
    </div>
  )
}

export default Visual3DES;
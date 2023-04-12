import React, {useState} from "react";
import { motion } from "framer-motion";

function Visual3DES(){
  const cellSize = 34;
  const durSpeed = 1;
  const [animating,setAnimating] = useState(false);
  const [done,setDone] = useState(false);
  const [t1,setT1] = useState("");
  const [g1,setG1] = useState(0);
  const [t2,setT2] = useState("");
  const [g2,setG2] = useState(0);
  const [t3,setT3] = useState("");
  const [t3Op,setT3Op] = useState(0.0);
  const [initKey,setInitKey] = useState("");
  const [kDisp,setKDisp] = useState(-36);
  const [key, setKey] = useState(Array(17).fill(""));
  const [inpX, setInpX] = useState(Array.from({length: 8}, () => Array(8).fill(-1)));
  const [inpP, setInpP] = useState(Array.from({length: 8}, () => Array(8).fill(-1)));
  const [g1Move, setG1Move] = useState(Array.from({length: 8}, () => Array(8).fill(0)));

  let ikey = "";
  const mapper = Array(16).fill(0);

  const ip = [[57, 49, 41, 33, 25, 17, 9,  1],
              [59, 51, 43, 35, 27, 19, 11, 3],
              [61, 53, 45, 37, 29, 21, 13, 5],
              [63, 55, 47, 39, 31, 23, 15, 7],
              [56, 48, 40, 32, 24, 16, 8,  0],
              [58, 50, 42, 34, 26, 18, 10, 2],
              [60, 52, 44, 36, 28, 20, 12, 4],
              [62, 54, 46, 38, 30, 22, 14, 6]];

 const ip_1 = [[39, 7, 47, 15, 55, 23, 63, 31],
              [38, 6, 46, 14, 54, 22, 62, 30],
              [37, 5, 45, 13, 53, 21, 61, 29],
              [36, 4, 44, 12, 52, 20, 60, 28],
              [35, 3, 43, 11, 51, 19, 59, 27],
              [34, 2, 42, 10, 50, 18, 58, 26],
              [33, 1, 41, 9,  49, 17, 57, 25],
              [32, 0, 40, 8,  48, 16, 56, 24]];

  const kp= [[56, 48, 40,  32, 24, 16,  8], // 6
             [ 0, 57, 49,  41, 33, 25, 17], // 13
             [ 9,  1, 58,  50, 42, 34, 26], // 20
             [ 18, 10, 2,  59, 51, 43, 35], // 27
             [ 62, 54, 46, 38, 30, 22, 14], // 34
             [  6, 61, 53, 45, 37, 29, 21], // 41
             [ 13,  5, 60, 52, 44, 36, 28], // 48
             [ 20, 12, 4,  27, 19, 11,  3]];// 55
  
const kp_1= [[  8, 17, 26, 62, 58, 49, 40], //6  |  7
             [  6, 16, 25, 61, 57, 48, 38], //14 | 15
             [  5, 14, 24, 60, 56, 46, 37], //22 | 23
             [  4, 13, 22, 59, 54, 45, 36], //30 | 31
             [  3, 12, 21, 30, 53, 44, 35], //38 | 39
             [  2, 11, 20, 29, 52, 43, 34], //46 | 47
             [  1, 10, 19, 28, 51, 42, 33], //54 | 55
             [  0,  9, 18, 27, 50, 41, 32]];//62 | 63

                

  function charToAscii(char) {
    return char.charCodeAt(0);
  }

  function isValidHex(hexString) {
    const hexRegex = /^[0-9a-fA-F]+$/;
    return hexRegex.test(hexString);
  }

  function choppedString(s,n){
    if(n<=0 || s.length === 0) return "";
    let ns = "";
    let i = 0;
    while(i + n < s.length){
      ns = ns + s.slice(i,i+n) + " ";
      i += n;
    }
    ns = ns + s.slice(i);
    return ns;
  }

  function randomKeys(){
    const vals = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    for(let i=1;i<=3;i++){
      let hex_string = "";
      for(let j=0;j<16;j++){
        let a = Math.floor(Math.random()*16)
        if(a === 16) a = 15;
        hex_string = hex_string + vals[a];
      }
      document.getElementById("k"+i).value = hex_string;
    }
  }

  function wordToAscii(){
    let textInput = document.getElementById("inp_plaintext");
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

  function hexToBinary(hex,len){
    let bin = "";
    const htb = ["0000","0001","0010","0011","0100","0101","0110","0111",
                 "1000","1001","1010","1011","1100","1101","1110","1111"];
    for(let i=0;i<16;i++){
      let a = parseInt(hex.charAt(i),16);
      bin = bin + htb[a];
    }
    return bin;
  }

  function visualEncrypt(){
    const k1 = document.getElementById("k1").value;
    const k2 = document.getElementById("k2").value;
    const k3 = document.getElementById("k3").value;
    if(!isValidHex(k1) || !isValidHex(k2) || !isValidHex(k3)) return;
    if(animating == true || done == true){
      reset(99);
      setTimeout(() => {
        animateIP();
      }, durSpeed * 2000);
    }
    else{
      animateIP();
    }
  }

  function animateIP(){
    setAnimating(true);
    getInpX();
    setTimeout(() => {
      setG2(1);
      setT2("Input Permutation Matrix");
      setTimeout(() => {
        setT3Op(1.0);
        setT3("Permutated Input");
        getG1Move(1);
        setTimeout(() => {
          animateKeyPerm();
        }, durSpeed * 5000);
      }, durSpeed * 2000);
    }, durSpeed * 2000);
  }

  function animateKeyPerm(){
    reset(2);
    setG2(2);
    setT3Op(0.0);
    setTimeout(() => {
      reset(3)
      setTimeout(() => {
        getKeys(1);
        setTimeout(() => {
          setT2("Key Permutation Matrix");
          setG2(3); 
          setTimeout(() => {
            getG1Move(2);
            setG1(3);
            setT3("Permutated Key (K[0])");
            setT3Op(1.0);
            setTimeout(() => {
              animateKey16();
              setAnimating(false);
              setDone(true);
            }, durSpeed * 3000);
          }, durSpeed * 2000);
        }, durSpeed * 2000);
      }, durSpeed * 2000);
    }, durSpeed * 2000);
  }

  function animateKey16(){
    reset(4);
    setTimeout(() => {
      showKeys16();
      key_disp_anim(-35);
      setTimeout(() => {
        setAnimating(false);
        setDone(true);
      }, durSpeed * 7000);
    }, durSpeed * 2000);
  }

  function reset(x){
    if(x === 1){
      setG1(0);
      setDone(false);
      setT1("");
      resInpX();
    }
    if(x === 2){
      setDone(false);
      setG1(-1);
    }
    if(x === 3){
      resG1Move();
    }
    if(x === 4){
      resG1Move();
      setT3Op(0);
      setG1(0);
      setG2(0);
    }
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
    setG1(1);
  }

  function resG1Move(){ // Reset IP matrix
    const newG1Move = [...g1Move];
    for(let i = 0; i<8; i++){
      for(let j = 0; j<8; j++){
        newG1Move[i][j] = 0;
      }
    }
    setG1Move(newG1Move);
  }

  function getG1Move(x){
    if(x === 1){
      const newInpP = [...inpP];
      for(let i = 0; i<8; i++){
        for(let j = 0; j<8; j++){
          const a = ip[i][j];
          newInpP[Math.floor(a/8)][a%8] = inpX[i][j];
        }
      }
      setInpP(newInpP);
      ip_perm_anim(0,0);
    }
    if(x === 2){
      ip_perm_anim(0,1);
    }
  }

  function grid1Text(i,j){
    if      (g1 === 1)  return inpX[i][j];
    else if (g1 === -1) return inpX[i][j];
    else if (g1 === 2)  return inpP[i][j];
    else if (g1 === 3)  return inpP[i][j];
    return "";
  }

  function grid2Text(i,j){
    if     (g2 === 1) return ip[i][j]+1;
    else if(g2 === 2) return ip[i][j]+1;
    else if(g2 === 3){
      if(j !== 7) return kp[i][j]+1;
      return "";
    }
    return "";
  }

  function grid1Op(i,j){
    if      (g1 === 1){
      return 1.0;
    }
    else if (g1 === 2){
      return 1.0;
    }
    else if (g1 === 3){
      return (j===7)? 0.0 : 1.0;
    }
    return 0.0;
  }

  function grid2Op(i,j){
    if      (g2 === 1){
      return 1.0;
    }
    else if (g2 === 2){
      return 0.0;
    }
    else if (g2 === 3){
      return 1.0;
    }
    return 0.0;
  }

  function grid1X(i,j){
    const c = g1Move[i][j];
    if(c === 0){
      return cellSize * (j+1);
    }
    else if(c === 1){
      return cellSize * (ip_1[i][j]%8+19);
    }
    else if(c === 2){
      if(j==7){
        return cellSize * (kp_1[i][j-1]%8+19);
      }
      return cellSize * (kp_1[i][j]%8+19);
    }
  }

  function grid2X(i,j){
    return cellSize * (j+10);
  }

  function grid1Y(i,j){
    const c = g1Move[i][j];
    if(c === 0){
      return cellSize * (i+1);
    }
    else if(c === 1){
      return cellSize * (Math.floor(ip_1[i][j]/8)+1);
    }
    else if(c === 2){
      if(j==7){
        return cellSize * (Math.floor(kp_1[i][j-1]/8)+1);
      }
      return cellSize * (Math.floor(kp_1[i][j]/8)+1);
    }
  }

  function grid2Y(i,j){
    return cellSize * (i+1);
  }

  function ip_perm_anim(x,s){
    const newG1Move = [...g1Move];
    if(s===0){
      const a = ip[Math.floor(x/8)][x%8];
      newG1Move[Math.floor(a/8)][a%8] = 1;
      setG1Move(newG1Move);
    }
    else if (s===1){
      if(x % 8 !== 7){
        const a = kp[Math.floor(x/8)][x%8];
        newG1Move[Math.floor(a/8)][a%8] = 2;
        setG1Move(newG1Move);
      }
    }
    
    if(x+1 < 64){
      setTimeout(()=>{
        ip_perm_anim(x+1,s)
      }, 15 * durSpeed);
    }
  }

  function key_disp_anim(x){
    setKDisp(x);
    if(x < 16){
      setTimeout(()=>{
        key_disp_anim(x+1);
      }, 80 * durSpeed);
    }
  }


  function getKeys(x){
    const key = hexToBinary(document.getElementById("k"+x).value,64);
    const newInpP = [...inpP];
    for(let i = 0; i<8; i++){
      for(let j = 0; j<8; j++){
        newInpP[i][j] = parseInt(key.charAt(i*8+j));
      }
    }
    let keyperm = "";
    for(let i=0; i<64; i++){
      if(i%8 !== 7){
        keyperm = keyperm + key.charAt(kp[Math.floor(i/8)][i%8]);
      }
    }
    setInitKey(keyperm);
    ikey = keyperm;
    setInpP(newInpP);
    setG1(2);
    setT1("K"+x+" (binary)");
  }

  function showKeys16(){
    const newKeys = [...key];
    newKeys[0] = ikey;//initKey;
    for(let i = 1; i<=16; i++){
      let l = newKeys[i-1].slice(0,28);
      let r = newKeys[i-1].slice(28);
      if(i === 1 || i === 2 || i === 9 || i === 16){
        l = l.slice(1)+l.charAt(0);
        r = r.slice(1)+r.charAt(0);
      }
      else{
        l = l.slice(2)+l.slice(0,2);
        r = r.slice(2)+r.slice(0,2);
      }
      let newKey = l + r;
      newKeys[i] = newKey;
    }
    console.log(newKeys);
    setKey(newKeys);
  }

  return (
    <div>
      <div className="input-3des">
        <label htmlFor="inp_plaintext">Enter Plaintext:</label>
        <input className="nInput" type="text" id="inp_plaintext" name="inp_plaintext" placeholder="Max 8 Characters" maxLength="8"></input>
        <button className="nInput" onClick={() => wordToAscii()}>To ASCII</button>
        <input className="nInput" type="number" id="n0" name="num0" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n1" name="num1" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n2" name="num2" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n3" name="num3" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n4" name="num4" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n5" name="num5" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n6" name="num6" min="0" max="255" defaultValue={0}/>
        <input className="nInput" type="number" id="n7" name="num7" min="0" max="255" defaultValue={0}/>
        <button className="nInput" onClick={() => visualEncrypt()}>Encrypt</button>
      </div>
      <div className="input-3des">
        <label >Enter Keys (in Hex):</label>
        <input className="nInput" type="text" id="k1" name="k1" maxLength="16" placeholder="K1 (16 Characters)" defaultValue={""}/>
        <input className="nInput" type="text" id="k2" name="k2" maxLength="16" placeholder="K2 (16 Characters)" defaultValue={""}/>
        <input className="nInput" type="text" id="k3" name="k3" maxLength="16" placeholder="K3 (16 Characters)" defaultValue={""}/>
        <button className="nInput" onClick={() => randomKeys()}>Randomize</button>
      </div>
      <div>
        {inpX.map((row, i) => (
          <div key={i}>
          {row.map((cell, j) => (
            <motion.div
              key={i+","+j}
              initial={{ opacity: grid1Op(i,j)}}
              animate={{ x: grid1X(i,j), 
                         y: grid1Y(i,j),
                         opacity: grid1Op(i,j)}}
              transition={{ type: "tween", duration: durSpeed * 1.5}}
              id={"Inp{"+i+"}{"+j+"}"}
              ><div className="cell">{grid1Text(i,j)}</div>
            </motion.div>
          ))}
          </div>
        ))}
        <motion.div
        initial={{ opacity: t3Op,
                  x: cellSize*23 - 63,
                  y:  cellSize*9 }}
        animate={{ opacity: t3Op }}
        transition={{ type: "tween", duration: durSpeed * 1.5}}
        id="tIP">
        <div className="aInput">{t3}</div>
        </motion.div>
      </div>
      <div>
        {ip.map((row, i) => (
          <div key={"ip-row"+i}>
          {row.map((cell, j) => (
            <motion.div
              key={"ip("+i+","+j+")"}
              initial={{ opacity: grid2Op(i,j),
                         x: grid2X(i,j), 
                         y: grid2Y(i,j), }}
              animate={{ opacity: grid2Op(i,j) }}
              transition={{ type: "tween", duration: durSpeed * 1.5}}
              id={"Inp{"+i+"}{"+j+"}"}
              ><div className={grid2Text(i,j)===""? "" : "cell"}>{grid2Text(i,j)}</div>
            </motion.div>
          ))}
          </div>
        ))}
        <motion.div
        initial={{ opacity: grid2Op(0,0),
                  x: cellSize*14 - 88,
                  y:  cellSize*9 }}
        animate={{ opacity: grid2Op(0,0) }}
        transition={{ type: "tween", duration: durSpeed * 1.5}}
        id="tIP">
        <div className="aInput">{t2}</div>
        </motion.div>
      </div>
      <div>
      <motion.div
        initial={{ opacity: (kDisp >= -35)? 1.0 : 0.0,
                  x: 20, 
                  y: 0 }}
        animate={{ opacity: (kDisp >= -35)? 1.0 : 0.0}}
        transition={{ type: "tween", duration: durSpeed * 1.5}}
        id={"K_info_Text"}
        ><div className="ab"><p>Now, we need to split the key into L and R elements, and create 16 subkeys via left-shifts </p></div>
      </motion.div>
        <motion.div
        initial={{ opacity: (kDisp >= -17)? 1.0 : 0.0,
                  x: 20, 
                  y: 40 }}
        animate={{ opacity: (kDisp >= -17)? 1.0 : 0.0}}
        transition={{ type: "tween", duration: durSpeed * 1.5}}
        id={"KTextN{0}"}
        ><div className="ab"><strong>Key 0:{`\t\t`}</strong></div>
      </motion.div>
        <motion.div
          initial={{ opacity: (kDisp >= -17)? 1.0 : 0.0,
                    x: 80, 
                    y: 40,}}
          animate={{ opacity: (kDisp >= -17)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"KText{0}"}
          ><div className="ab">{choppedString(key[0],7)}</div>
        </motion.div>
      </div>
      <div>
        {mapper.map((item, i) => (
          <div>
            <motion.div
            key={"K_text_N_"+(i+1)}
            initial={{ opacity: (kDisp >= i+1)? 1.0 : 0.0,
                       x: 20, 
                       y: 70 + 20 * (i),}}
            animate={{ opacity: (kDisp >= i+1)? 1.0 : 0.0}}
            transition={{ type: "tween", duration: durSpeed * 1.5}}
            id={"KTextN{"+i+"}"}
            ><div className="ab"><strong>Key {i+1}:{`\t\t`}</strong></div>
          </motion.div>
            <motion.div
              key={"K_text_"+(i+1)}
              initial={{ opacity: (kDisp >= i+1)? 1.0 : 0.0,
                         x: 80, 
                         y: 70 + 20 * (i),}}
              animate={{ opacity: (kDisp >= i+1)? 1.0 : 0.0}}
              transition={{ type: "tween", duration: durSpeed * 1.5}}
              id={"KText{"+i+"}"}
              ><div className="ab">{choppedString(key[i+1],7)}</div>
            </motion.div>
          </div>
        ))}
      </div>
      <div>
        <motion.div
          initial={{ opacity: grid1Op(0,0),
                    x: cellSize*5 - 75,
                    y: cellSize*9 }}
          animate={{ opacity: grid1Op(0,0)}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id="t1">
          <div className="aInput">{t1}</div>
        </motion.div>
      </div>
      <div style={{padding: "20px", opacity:(done === false && animating === false)? 1 : 0}}>
        <h3>Enter your input (or adjust the 8 number values) to begin.</h3>
        <p>3DES/DES encrypts data in 64-bit "blocks." For the visualization, we will only encrypt one block.</p>      
      </div>
    </div>
  )
}

export default Visual3DES;
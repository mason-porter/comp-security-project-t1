import React, {useState} from "react";
import { motion } from "framer-motion";

function Visual3DES(){
  const cellSize = 34;
  const durSpeed = 1;
  const [animating,setAnimating] = useState(false);
  const [done,setDone] = useState(false);
  const [t1,setT1] = useState("");
  const [t12,setT12] = useState("");
  const [t12Op,setT12Op] = useState(0.0);
  const [g1,setG1] = useState(0);
  const [t2,setT2] = useState("");
  const [g2,setG2] = useState(0);
  const [t3,setT3] = useState("");
  const [t3Op,setT3Op] = useState(0.0);
  //const [initKey,setInitKey] = useState("");
  const [kDisp,setKDisp] = useState(-50);
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

  const pc1 = [[56, 48, 40,  32, 24, 16,  8], // 6
             [ 0, 57, 49,  41, 33, 25, 17], // 13
             [ 9,  1, 58,  50, 42, 34, 26], // 20
             [ 18, 10, 2,  59, 51, 43, 35], // 27
             [ 62, 54, 46, 38, 30, 22, 14], // 34
             [  6, 61, 53, 45, 37, 29, 21], // 41
             [ 13,  5, 60, 52, 44, 36, 28], // 48
             [ 20, 12, 4,  27, 19, 11,  3]];// 55
  
const pc1_1= [[  8, 17, 26, 62, 58, 49, 40], //6  |  7
             [  6, 16, 25, 61, 57, 48, 38], //14 | 15
             [  5, 14, 24, 60, 56, 46, 37], //22 | 23
             [  4, 13, 22, 59, 54, 45, 36], //30 | 31
             [  3, 12, 21, 30, 53, 44, 35], //38 | 39
             [  2, 11, 20, 29, 52, 43, 34], //46 | 47
             [  1, 10, 19, 28, 51, 42, 33], //54 | 55
             [  0,  9, 18, 27, 50, 41, 32]];//62 | 63

const pc2=   [[13, 16, 10, 23,  0,  4],  //  5
              [ 2, 27, 14,  5, 20,  9],  // 11
              [22, 18, 11,  3, 25,  7],  // 17
              [15,  6, 26, 19, 12,  1],  // 23
              [40, 51, 30, 36, 46, 54],  // 29
              [29, 39, 50, 44, 32, 47],  // 35
              [43, 48, 38, 55, 33, 52],  // 41
              [45, 41, 49, 35, 28, 31]]; // 47

const pc2_1= [[ 4, 23,  6, 15,  5,  9, 19], // 6
              [17, -1, 11,  2, 14, 22,  0], // 13
              [ 8, 18,  1, -1, 13, 21, 10], // 20
              [-1, 12,  3, -1, 16, 20,  7], // 27
              [46, 30, 26, 47, 34, 40, -1], // 34
              [45, 27, -1, 38, 31, 24, 43], // 41
              [-1, 36, 33, 42, 28, 35, 37], //48
              [44, 32, 25, 41, -1, 29, 39]]; // 55
              
const lsh_1 = [[27,  0,  1,  2,  3,  4,  5],
               [ 6,  7,  8,  9, 10, 11, 12],
               [13, 14, 15, 16, 17, 18, 19],
               [20, 21, 22, 23, 24, 25, 26],
               [55, 28, 29, 30, 31, 32, 33],
               [34, 35, 36, 37, 38, 39, 40],
               [41, 42, 43, 44, 45, 46, 47],
               [48, 49, 50, 51, 52, 53, 54]];

                

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
    if(animating === true || done === true){
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
    setDone(false);
    getInpX();
    setTimeout(() => {
      setG2(1);
      setT2("Input Permutation Matrix");
      setTimeout(() => {
        setT3Op(1.0);
        setT3("Permutated Input");
        getG1Move(1);
        setTimeout(() => {
          animateKeyPerm1();
        }, durSpeed * 4000);
      }, durSpeed * 2000);
    }, durSpeed * 2000);
  }

  function animateKeyPerm1(){
    reset(2);
    setG2(2);
    setT3Op(0.0);
    setTimeout(() => {
      reset(3)
      setTimeout(() => {
        getKeys(1);
        setTimeout(() => {
          setT2("Key Permutation Matrix PC1");
          setG2(3); 
          setTimeout(() => {
            getG1Move(2);
            setG1(3);
            setT3("Permutated Key (K[0])");
            setT3Op(1.0);
            setTimeout(() => {
              animateKeyPerm2();
            }, durSpeed * 3000);
          }, durSpeed * 2000);
        }, durSpeed * 2000);
      }, durSpeed * 2000);
    }, durSpeed * 2000);
  }

  function animateKeyPerm2(){
    setT3Op(0.0);
    reset(4);
    showKeys16();
    setTimeout(() => {
      setT1("Key After PC1 (K[0])");
      setG1(4);
      setTimeout(() => {
        setT12("After L-Shifting each half");
        setT12Op(1.0);
        getG1Move(3);
        setTimeout(() => {
          setT2("Key Permutation Matrix PC2");
          setG2(4); 
          setTimeout(() => {
            setG1(5);
            setT3Op(1.0);
            setT3("Permutated Subkey (K[1])");
            getG1Move(4);
            setTimeout(() => {
              animateKey16();
            }, durSpeed * 4000);
          }, durSpeed * 2000);
        }, durSpeed * 2000);
      }, durSpeed * 2000);
    }, durSpeed * 2000);
  }

  function animateKey16(){
    reset(4);
    setTimeout(() => {
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
      setT12Op(0.0);
    }
    if(x === 99){
      setG1(-1);
      resG1Move();
      setT3Op(0);
      setG1(0);
      setG2(0);
      setT12Op(0.0);
      setKDisp(-50);
      setT1("");
      resInpX();
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
    if(x === 3){
      const newG1Move = [...g1Move];
      for(let i = 0; i<8; i++){
        for(let j = 0; j<8; j++){
          newG1Move[i][j] = 3;
        }
      }
      setG1Move(newG1Move);
    }
    if(x === 4){
      ip_perm_anim(0,2);
    }
  }

  function grid1Text(i,j){
    if      (g1 === 1)  return inpX[i][j];
    else if (g1 === -1) return inpX[i][j];
    else if (g1 === 2)  return inpP[i][j];
    else if (g1 === 3)  return inpP[i][j];
    else if (g1 === 4)  return (j%8===7)? -1 : key[0][i*7+j];
    else if (g1 === 5)  return (j%8===7)? -1 : key[0][i*7+j];
    return "";
  }

  function grid2Text(i,j){
    if     (g2 === 1) return ip[i][j]+1;
    else if(g2 === 2) return ip[i][j]+1;
    else if(g2 === 3){
      if(j !== 7) return pc1[i][j]+1;
      return "";
    }
    else if(g2 === 4){
      if(j < 6) return pc2[i][j]+1;
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
      return (j<7)? 1.0 : 0.0;
    }
    else if (g1 === 4){
      return (j<7)? 1.0 : 0.0;
    }
    else if (g1 === 5){
      if(j === 7) return 0.0;
      const ni = Math.floor(lsh_1[i][j]/7);
      const nj = lsh_1[i][j]%7;
      if(pc2_1[ni][nj] === -1) return 0.0;
      return 1.0;
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
    else if (g2 === 4){
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
      if(j===7){
        return cellSize * (pc1_1[i][j-1]%8+19);
      }
      return cellSize * (pc1_1[i][j]%8+19);
    }
    else if(c === 3){
      if(j===7){
        return cellSize;
      }
      return cellSize * (lsh_1[i][j]%7+1);
    }
    else if(c === 4){
      if(j===7){
        return cellSize;
      }
      const ni = Math.floor(lsh_1[i][j]/7);
      const nj = lsh_1[i][j]%7;
      return cellSize * (pc2_1[ni][nj]%6+19);
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
      if(j===7){
        return cellSize * (Math.floor(pc1_1[i][j-1]/8)+1);
      }
      return cellSize * (Math.floor(pc1_1[i][j]/8)+1);
    }
    else if(c === 3){
      if(j===7){
        return cellSize;
      }
      return cellSize * (Math.floor(lsh_1[i][j]/7)+1);
    }
    else if(c === 4){
      const ni = Math.floor(lsh_1[i][j]/7);
      const nj = lsh_1[i][j]%7;
      return cellSize * (Math.floor(pc2_1[ni][nj]/6)+1);
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
      if(x+1 < 64){
        setTimeout(()=>{
          ip_perm_anim(x+1,s)
        }, 15 * durSpeed);
      }
    }
    else if (s===1){
      if(x % 8 !== 7){
        const a = pc1[Math.floor(x/8)][x%8];
        newG1Move[Math.floor(a/8)][a%8] = 2;
        setG1Move(newG1Move);
      }
      if(x+1 < 64){
        setTimeout(()=>{
          ip_perm_anim(x+1,s)
        }, 15 * durSpeed);
      }
    }
    else if (s===2){
      //const a = pc2[Math.floor(x/6)][x%6];
      //const la = rsh_1[Math.floor(a/7)][a%7];
      newG1Move[Math.floor(x/7)][x%7] = 4;
      setG1Move(newG1Move);
      if(x+1 < 56){
        setTimeout(()=>{
          ip_perm_anim(x+1,s)
        }, 15 * durSpeed);
      }
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
        keyperm = keyperm + key.charAt(pc1[Math.floor(i/8)][i%8]);
      }
    }
    ikey = keyperm;
    setInpP(newInpP);
    setG1(2);
    setT1("K"+x+" (binary)");
  }

  function showKeys16(){
    const newKeys = [...key];
    newKeys[0] = ikey;//initKey;
    let l = newKeys[0].slice(0,28);
    let r = newKeys[0].slice(28);
    for(let i = 1; i<=16; i++){
      if(i === 1 || i === 2 || i === 9 || i === 16){
        l = l.slice(1)+l.charAt(0);
        r = r.slice(1)+r.charAt(0);
      }
      else{
        l = l.slice(2)+l.slice(0,2);
        r = r.slice(2)+r.slice(0,2);
      }
      let nextKey = l + r;
      newKeys[i] = perm_pc2(nextKey);
    }
    console.log(newKeys);
    setKey(newKeys);
  }

  function perm_pc2(key){
    console.log(key.length);
    let newKey = "";
    for(let i = 0; i<48; i++){
      let r = Math.floor(i/6);
      let c = i%6;
      newKey = newKey + key[pc2[r][c]];
    }
    return newKey;
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
          <div key={"G1-Row-"+i}>
          {row.map((cell, j) => (
            <motion.div
              key={"G1:"+i+","+j}
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
        initial={{ opacity: (kDisp >= -45)? 1.0 : 0.0,
                  x: 20, 
                  y: 0 }}
        animate={{ opacity: (kDisp >= -45)? 1.0 : 0.0}}
        transition={{ type: "tween", duration: durSpeed * 1.5}}
        id={"K_info_Text"}
        ><div className="ab"><p>We will repeat these steps for subkeys 2 through 16, using left shifts and the PC2 Matrix:</p></div>
      </motion.div>
        <motion.div
        initial={{ opacity: (kDisp >= -25)? 1.0 : 0.0,
                  x: 20, 
                  y: 40 }}
        animate={{ opacity: (kDisp >= -25)? 1.0 : 0.0}}
        transition={{ type: "tween", duration: durSpeed * 1.5}}
        id={"KTextN{0}"}
        ><div className="ab"><strong>Key 0:{`\t\t`}</strong></div>
      </motion.div>
        <motion.div
          initial={{ opacity: (kDisp >= -25)? 1.0 : 0.0,
                    x: 80, 
                    y: 40,}}
          animate={{ opacity: (kDisp >= -25)? 1.0 : 0.0}}
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
            initial={{ opacity: (kDisp >= (i+1))? 1.0 : 0.0,
                       x: 20, 
                       y: 70 + 20 * (i),}}
            animate={{ opacity: (kDisp >= (i+1))? 1.0 : 0.0}}
            transition={{ type: "tween", duration: durSpeed * 1.5}}
            id={"KTextN{"+i+"}"}
            ><div className="ab"><strong>Subkey {i+1}:{`\t\t`}</strong></div>
          </motion.div>
            <motion.div
              key={"K_text_"+(i+1)}
              initial={{ opacity: (kDisp >= (i+1))? 1.0 : 0.0,
                         x: 120, 
                         y: 70 + 20 * (i),}}
              animate={{ opacity: (kDisp >= (i+1))? 1.0 : 0.0}}
              transition={{ type: "tween", duration: durSpeed * 1.5}}
              id={"KText{"+i+"}"}
              ><div className="ab">{choppedString(key[i+1],6)}</div>
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
        <motion.div
          initial={{ opacity: t12Op,
                    x: cellSize*5 - 75,
                    y: cellSize*9  + 20}}
          animate={{ opacity: t12Op}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id="t12">
          <div className="aInput">{t12}</div>
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
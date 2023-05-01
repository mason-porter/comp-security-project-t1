import React, {useState} from "react";
import { motion } from "framer-motion";

function Visual3DES(){
  const cellSize = 34;
  const [durSpeed,setDurSpeed] = useState(1);
  const [dSpeed,setDSpeed] = useState(5);
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
  const [tdes_result,set3DES]  = useState(Array(6).fill(""));
  const [dwn,setDwn] = useState(false);
  const [dtime,setDTime] = useState(-1.0);
  const [hexInp,setHexInp] = useState("0000000000000000");
  //const [initKey,setInitKey] = useState("");
  const [kDisp,setKDisp] = useState(-50);
  const [desDisp,setDesDisp] = useState(0);
  const [desDisp2,setDesDisp2] = useState(0);
  const [desDisp16,setDesDisp16] = useState(0);
  const [des3,set3desDisp] = useState(0);
  const [key, setKey] = useState(Array(17).fill(""));
  const [inpX, setInpX] = useState(Array.from({length: 8}, () => Array(8).fill(-1)));
  const [inpP, setInpP] = useState(Array.from({length: 8}, () => Array(8).fill(-1)));
  const [g1Move, setG1Move] = useState(Array.from({length: 8}, () => Array(8).fill(0)));
  const [perm_inp,setPermInp]=useState("");
  // DES step stages
  const [k_enc,setKENC] = useState(true);
  const [s_l0, setSL0] = useState("");
  const [s_r0, setSR0] = useState("");
  const [s_el1,setEL1] = useState("");
  const [s_pr1,setSPR1]= useState("");
  const [s_skel1,setSKEL1] = useState("");
  const [s_r1, setSR1] = useState("");
  const [s_ker,setKer] = useState("");
  const [s_pker,setPker]=useState("");
  const [s_int,setSInt]=useState(Array.from({length: 16}, () => Array(2).fill(" ")));
  const [s_final,setSFinal] = useState("");
  const e48 = [32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 
               13, 12, 13, 14, 15, 16, 17, 16, 17, 18, 19, 20, 21, 20, 
               21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1];
  const [slcData, setSliceData] = useState(Array.from({length: 8}, () => Array(4).fill(0)));
  //
  let inpIP = "";
  let ikey = "";
  const mapper8  = Array(8).fill(null);
  const mapper16 = Array(16).fill(null);
  const mapper32 = Array(32).fill(null);
  const mapper48 = Array(48).fill(null);
  const l  = [];
  const r  = [];
  const ff = [];
  const sld = Array.from({length: 8}, () => Array(4).fill(0));
  let kenc = true;

  const sp = [[[14,  4, 13,  1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9,  0,  7],
              [ 0, 15,  7,  4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5,  3,  8],
              [ 4,  1, 14,  8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10,  5,  0],
              [15, 12,  8,  2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0,  6, 13]],
             [[15,  1,  8, 14,  6, 11,  3,  4,  9,  7,  2, 13, 12,  0,  5, 10],
              [ 3, 13,  4,  7, 15,  2,  8, 14, 12,  0,  1, 10,  6,  9, 11,  5],
              [ 0, 14,  7, 11, 10,  4, 13,  1,  5,  8, 12,  6,  9,  3,  2, 15],
              [13,  8, 10,  1,  3, 15,  4,  2, 11,  6,  7, 12,  0,  5, 14,  9]],
             [[10,  0,  9, 14,  6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8],
              [13,  7,  0,  9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1],
              [13,  6,  4,  9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7],
              [ 1, 10, 13,  0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12]],
             [[7,  13, 14,  3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15], 
              [13,  8, 11,  5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9],  
              [10,  6,  9,  0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4],  
              [3,  15,  0,  6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14]],
             [[2,  12, 4, 1,  7,  10, 11, 6, 8,  5,  3,  15, 13,0,  14, 9], 
              [14, 11, 2,  12, 4, 7,  13, 1,  5,  0,15, 10, 3, 9,  8,  6],  
              [4,  2, 1,  11, 10, 13, 7,8,  15, 9, 12, 5,  6,  3,  0, 14], 
              [11, 8,  12, 7,1,  14, 2, 13, 6,  15, 0,  9, 10, 4,  5,  3]],
              [[12, 1,  10, 15, 9,  2,  6,  8,  0,  13, 3, 4, 14, 7,  5,  11], 
          [10, 15, 4,  2,  7,  12, 9,  5, 6, 1, 13, 14, 0,  11, 3,  8],  
          [9,  14, 15, 5,  2, 8, 12, 3,  7,  0,  4,  10, 1,  13, 11, 6],  
          [4,  3, 2, 12, 9,  5,  15, 10, 11, 14, 1,  7,  6,  0,  8, 13]],
          [[4,  11, 2,  14, 15, 0,  8, 13, 3,  12, 9,  7,  5, 10, 6,  1],  
          [13, 0,  11, 7, 4,  9,  1,  10, 14, 3, 5,  12, 2,  15, 8,  6],  
          [1, 4,  11, 13, 12, 3,  7, 14, 10, 15, 6,  8,  0,  5, 9,  2],  
          [6,  11, 13, 8, 1,  4,  10, 7,  9,  5,  0, 15, 14, 2,  3,  12]],
          [[13, 2,  8, 4,  6,  15, 11, 1,  10, 9, 3, 14, 5, 0,  12, 7], 
          [1,  15, 13, 8,  10, 3,  7, 4, 12, 5, 6,  11, 0, 14, 9,  2],  
          [7,  11, 4,  1, 9, 12, 14, 2,  0,  6, 10, 13, 15, 3,  5,  8],  
          [2, 1, 14, 7, 4,  10, 8, 13, 15, 12, 9,  0,  3,  5, 6, 11]]
            ];

  const p_perm = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
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

/*const lsh_1 = [[1,2,3,4,5,6,7],
                [8,9,10,11,12,13,14],
                [15,16,17,18,19,20,21],
                [22,23,24,25,26,27, 0],
                [29,30,31,32,33,34,35],
                [36,37,38,39,40,41,42],
                [43,44,45,46,47,48,49],
                [50,51,52,53,54,55,28]];*/

  function charToAscii(char) {
    return char.charCodeAt(0);
  }

  function isValidHex(hexString) {
    const hexRegex = /^[0-9a-fA-F]+$/;
    return hexRegex.test(hexString);
  }

  function choppedString(s,n){
    if(n<=0) return "";
    if(s===undefined) return "";
    if(s.length===0) return "";
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

  function f(r,k,i){
    let nker = xor(k,expand48(r));
    if(i===1){
      setKer(nker);
      // console.log(r);
      // console.log(k);
      // console.log(choppedString(nker,6));
    }
    return p(s_perm(nker,i),i);
  }

  function p(x,i){
    let ret = ""
    for(let i = 0; i < 32; i++){
      ret += x[p_perm[i]-1];
    }
    if(i===1){
      setPker(ret);
    }
    return ret;
  }

  function xor(x,y){
    let ret = "";
    if(x.length != y.length){
      return ret;
    }
    const n = x.length;
    for(let i = 0; i < n; i++){
      if(x[i]==="1" && y[i]==="0" || x[i]==="0" && y[i]==="1"){
        ret += "1";
      }
      else{
        ret += "0";
      }
    }
    return ret;
  }

  function s_perm(inp,x=-1){
    let ret = "";
    for(let i = 0; i < 8; i++){
      let slce = s(inp.slice(i*6,i*6+6),i+1,x);
      ret += slce;
    }
    if(x===1){
      setSKEL1(ret);
      setSliceData(sld);
    }
    return ret;
  }

  function expand48(inp){
    let ret = ""
    let idx = 32
    for(let i = 0; i < 8; i++){
      for(let j = 0; j < 6; j++){
        ret += inp[idx-1]
        idx += 1;
        if(idx > 32){
          idx -= 32;
        }
      }
      idx -= 2;
    }
    return ret;
  }

  function s(x,n,i){
    let row = parseInt(x.slice(0,1)+x.slice(5),2);
    let col = parseInt(x.slice(1,5),2);
    if(i === 1){
      const newRow = [row,col,sp[n-1][row][col],decimalToBinary(sp[n-1][row][col],4)];
      sld[n-1] = newRow;   
    }
    return decimalToBinary(sp[n-1][row][col],4);
  }

  function genLFR(keys){
    let first = inpIP;
    l.push(first.slice(0,32));
    ff.push(" ");
    r.push(first.slice(32));
    const newFinal = [...s_int];
    for(let i = 1; i<=16; i++){
      l.push(r[i-1]);
      if(i===1){
        setEL1(expand48(l[1]));
      }
      ff.push(f(l[i],keys[i],i));
      r.push(xor(l[i-1],ff[i]));
      newFinal[i-1][0] = l[i];
      newFinal[i-1][1] = r[i];
    }
    setSInt(newFinal);
    setSFinal(r[16]+l[16]);
    setSL0(l[0]);
    setSR0(r[0]);
    setSPR1(ff[1]);
    setSR1(r[1]);
  }

  const handleDwnToggle = () => {
    setDwn(!dwn);
  };

  function downloadFile(content,e=true){
    let fileName = (e===true)? "encrypted-file.txt" : "decrypted-file.txt";
    const blob = new Blob(["0x"+content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  function stringToHex(inp){
    let res = "";
    for(let i=0; i<inp.length; i++){
      let c = inp.charCodeAt(i);
      res += binaryToHex(decimalToBinary(c));
    }
    return res;
  }

  function fileToHex(event){
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const string = reader.result;
      let res = (string.slice(0,2)==="0x")? string.slice(2) : stringToHex(string);
      let ascii = binaryToAscii(hexToBinary(string));
      setHexInp(res.padEnd(16,'0'));
      document.getElementById("inp_plaintext").value = ascii;
    };
    reader.readAsBinaryString(file);
  }

  function wordToHex(x=0,inp=""){
    let cinp = ""
    if(x === 0){
      cinp = document.getElementById("inp_plaintext").value;
    }
    else if(x === 1){
      cinp = inp;
    }
    let ret = "";
    for(let i=0;i<cinp.length;i++){
      ret += binaryToHex(decimalToBinary(charToAscii(cinp[i])));
    }
    setHexInp(ret.padEnd(16,'0'));
  }

  function decimalToBinary(decimal,n=8) {
    var binaryString = decimal.toString(2);
    while (binaryString.length < n) {
      binaryString = "0" + binaryString;
    }
    return binaryString;
  }

  function hexToBinary(hex,n=16){
    let bin = "";
    const htb = ["0000","0001","0010","0011","0100","0101","0110","0111",
                 "1000","1001","1010","1011","1100","1101","1110","1111"];
    for(let i=0;i<n;i++){
      let a = parseInt(hex.charAt(i),16);
      bin = bin + htb[a];
    }
    return bin;
  }

  function binaryToAscii(bin){ 
    if(bin==undefined) return "";
    var str = '';
    for (var n = 0; n < bin.length; n += 8) {
      str += String.fromCharCode(parseInt(bin.substr(n, 8), 2));
    }
    return str;
  }

  function handleAnimSpeed(event){
    setDSpeed(event.target.value);
    setDurSpeed(5/event.target.value);
  }

  function binaryToHex(bin){
    if(bin === undefined) return "";
    if(bin.length === 0 || bin.length % 4 !== 0) return;
    let ret = "";
    const n = bin.length/4;
    const bth = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    for(let i=0;i<n;i++){
      let bin_slice = parseInt(bin.slice(i*4,(i+1)*4),2);
      ret += bth[bin_slice];
    }
    return ret;
  }

  function visual3DES(enc=true){
    kenc = enc;
    const k1 = document.getElementById("k1").value;
    const k2 = document.getElementById("k2").value;
    const k3 = document.getElementById("k3").value;
    if(!isValidHex(k1) || !isValidHex(k2) || !isValidHex(k3)) return;
    let res = "";
    if(dwn===false){
      setDTime(-1.0);
      if(animating === true || done === true){
        reset(99);
        setTimeout(() => {
          animateIP();
        }, durSpeed * 2000);
      }
      else{
        setTimeout(() => {
          animateIP();
        }, durSpeed * 50);
      }
    }
    else{
      let startTime = performance.now();
      res = quick_full_3des(hexInp,enc);
      let endTime = performance.now();
      let diff = (endTime - startTime) / 1000;
      downloadFile(res,enc);
      setDTime(diff);
    }
  }

  function animateIP(){
    quick_3des_begin(kenc);
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
        }, durSpeed * 7000);
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
        showKeys16(kenc);
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
            }, durSpeed * 6000);
          }, durSpeed * 2000);
        }, durSpeed * 2000);
      }, durSpeed * 2000);
    }, durSpeed * 2000);
  }

  function animateKeyPerm2(){
    setT3Op(0.0);
    reset(4);  
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
            setT3((kenc===true)? "Permutated Subkey (K[1])" : "Permutated Subkey (K[16])");
            getG1Move(4);
            setTimeout(() => {
              animateKey16();
            }, durSpeed * 7500);
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
        animateDES();
      }, durSpeed * 7000);
    }, durSpeed * 2000);
  }

  function animateDES(){
    reset(5);
    setTimeout(() => {
      des_disp_anim(0,450);
      setTimeout(() => {
        setDesDisp(0);
        setTimeout(() => {
          des_disp_anim2(0,400);
          setTimeout(() => {
            setDesDisp2(0);
            setTimeout(() => {
              des_disp_anim16(0,200);
              setTimeout(() => {
                animate_final_ip();
              }, durSpeed * 20000);
            }, durSpeed * 2000);
          }, durSpeed * 40000);
        }, durSpeed * 2000);
      }, durSpeed * 42000);
    }, durSpeed * 2000);
  }

  function animate_final_ip(){
    reset(6);
    setTimeout(() => {
      setG1(6);
      setT1("Cipher before IP-1");
      setTimeout(() => {
        setG2(6);
        setT2("Final Permutation Matrix IP-1");
        setTimeout(() => {
          setT3Op(1.0);
          setT3("Final Result");
          getG1Move(5);
          setTimeout(() => {
            animate_triple_des();
          }, durSpeed * 8000);
        }, durSpeed * 3000);
      }, durSpeed * 2000); 
    }, durSpeed * 2000); 
  }

  function animate_triple_des(){
    reset(7);
    setTimeout(() => {
      tdes_anim(0,200);
      resG1Move();
      setTimeout(() => {
        setAnimating(false);
        setDone(true);
      }, durSpeed * 18000);
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
    if(x === 5){
      setKDisp(-50);
    }
    if(x===6){
      resG1Move();
      setDesDisp(0);
      setDesDisp2(0);
      setDesDisp16(0);
    }
    if(x===7){
      setT3Op(0);
      setG1(0);
      setG2(0);
      setDesDisp(0);
      setDesDisp2(0);
      setDesDisp16(0);
    }
    if(x === 99){
      setG1(-1);
      resG1Move();
      setT3Op(0);
      setG1(0);
      setG2(0);
      setT12Op(0.0);
      setKDisp(-50);
      setDesDisp(0);
      setT1("");
      resInpX();
      set3desDisp(0);
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

  function getIPInput(orig){
    let input_ip = "";
    for(let i=0; i<64; i++){
      let x = ip[Math.floor(i/8)][i%8];
      let t = orig[Math.floor(x/8)][x%8];
      input_ip += (t===0)? "0" : "1";
    }
    //console.log(choppedString(input_ip,8));
    inpIP = input_ip;
    setPermInp(input_ip);
  }

  function getInpX(){ // Get initial Input
    const newInpX = [...inpX];
    let inp = hexToBinary(hexInp);
    for(let i = 0; i<8; i++){
      for(let j = 0; j<8; j++){
        newInpX[i][j] = parseInt(inp[i*8+j]);
      }
    }
    setT1("Input Block (64-bits)");
    setInpX(newInpX);
    getIPInput(newInpX);
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
    if(x === 5){
      ip_perm_anim(0,3);
    }
  }

  function grid1Text(i,j){
    if      (g1 === 1)  return inpX[i][j];
    else if (g1 === -1) return inpX[i][j];
    else if (g1 === 2)  return inpP[i][j];
    else if (g1 === 3)  return inpP[i][j];
    else if (g1 === 4)  return (j%8===7)? -1 : key[0][i*7+j];
    else if (g1 === 5)  return (j%8===7)? -1 : key[0][i*7+j];
    else if (g1 === 6)  return s_final[i*8+j] ?? "";
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
    else if(g2 === 6){
      return ip_1[i][j]+1;
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
    else if(g1 === 6){
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
    else if (g2 === 6){
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
    else if(c === 5){
      return cellSize * (ip[i][j]%8+19);
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
    else if(c === 5){
      return cellSize * (Math.floor(ip[i][j]/8)+1);
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
    else if(s===3){
      const a = ip_1[Math.floor(x/8)][x%8];
      newG1Move[Math.floor(a/8)][a%8] = 5;
      setG1Move(newG1Move);
      if(x+1 < 64){
        setTimeout(()=>{
          ip_perm_anim(x+1,s)
        }, 15 * durSpeed);
      }
    }
  }

  function tdes_anim(x,l){
    set3desDisp(x);
    if(x < l){
      setTimeout(()=>{
        tdes_anim(x+1,l);
      }, 80 * durSpeed);
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

  function des_disp_anim(x,l){
    setDesDisp(x);
    if(x < l){
      setTimeout(()=>{
        des_disp_anim(x+1,l);
      }, 80 * durSpeed);
    }
  }

  function des_disp_anim2(x,l){
    setDesDisp2(x);
    if(x < l){
      setTimeout(()=>{
        des_disp_anim2(x+1,l);
      }, 80 * durSpeed);
    }
  }

  function des_disp_anim16(x,l){
    setDesDisp16(x);
    if(x < l){
      setTimeout(()=>{
        des_disp_anim16(x+1,l);
      }, 80 * durSpeed);
    }
  }

  function getKeys(x){
    const key = hexToBinary(document.getElementById("k"+x).value);
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

  function showKeys16(encrypt){
    const newKeys = [...key];
    newKeys[0] = ikey;//initKey;
    //console.log(choppedString(ikey,7))
    let l = newKeys[0].slice(0,28);
    let r = newKeys[0].slice(28);
    //console.log(l);
    //console.log(r);
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
      if(encrypt === true){
        newKeys[i] = perm_pc2(nextKey);
      }
      else{
        newKeys[17-i] = perm_pc2(nextKey);
      }
    }
    //console.log(newKeys);
    setKey(newKeys);
    genLFR(newKeys);
  }

  function perm_pc2(key){
    // console.log(key.length);
    let newKey = "";
    for(let i = 0; i<48; i++){
      let r = Math.floor(i/6);
      let c = i%6;
      newKey = newKey + key[pc2[r][c]];
    }
    return newKey;
  }

///// QUICK DES

function quick_des(plain,key,encrypt=true){
  const inp_ip = quick_ip(plain);
  const ql = [inp_ip.slice(0,32)];
  const qf = [" "];
  const qr = [inp_ip.slice(32)];
  let qk = quick_generate_keys(key)
  if(encrypt===false){ qk = qk.reverse(); }
  for(let i=1; i<=16; i++){
    ql.push(qr[i-1]);
    qf.push( quick_f(ql[i],qk[i-1]) );
    qr.push( quick_xor(ql[i-1],qf[i]));
    // console.log("K"+i+": "+choppedString(qk[i-1],6))
    // console.log("Step "+i+": "+choppedString((ql[i]+qr[i]),8));
  }
  return quick_ip_inv(qr[16]+ql[16]);
}

function quick_ip(inp){
  let ret = ""
  const ori = [58,60,62,64,57,59,61,63]
  for(let i=0; i<8; i++){
    for(let j=0; j<8;j++){
      ret += inp[(ori[i]-(j*8))-1];
    }
  }
  return ret;
}

function quick_ip_inv(inp){
  let ret = "";
  const ori = [39,7,47,15,55,23,63,31];
  for(let i=0; i<8; i++){
    for(let j=0; j<8; j++){
      ret += inp[ori[j]-i];
    }
  }
  return ret;
}

function quick_pc1(k){
  let ret = "";
  const perm = [57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];
  for(let i=0;i<56;i++){
    ret += k[perm[i]-1];
  }
  return ret;
}

function quick_pc2(k){
  let ret = "";
  const perm = [14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];
  for(let i=0;i<48;i++){
    ret += k[perm[i]-1];
  }
  return ret;
}

function quick_f(r,k){
  let ker = quick_xor(k,quick_e48(r));
  return quick_p( quick_s_perm( ker ) );
}

function quick_p(x){
  let ret = ""
  const perm = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
  for(let i=0; i<32; i++){
    ret += x[perm[i]-1];
  }
  return ret;
}

function quick_s_perm(inp){
  let ret = "";
  for(let i = 0; i < 8; i++){
    let slce = quick_s(inp.slice(i*6,i*6+6),i);
    ret += slce;
  }
  return ret;
}

function quick_s(inp,n){
  let row = parseInt(inp.slice(0,1)+inp.slice(5),2);
  let col = parseInt(inp.slice(1,5),2);
  return decimalToBinary(sp[n][row][col],4);
}

function quick_e48(inp){
  let ret = "";
  let s = 32;
  for(let i=0; i<8; i++){
    for(let j=0; j<6; j++){
      ret += inp[s-1];
      s += 1;
      if(s > 32){
        s -= 32;
      }
    }
    s -= 2;
  }
  return ret;
}

function quick_xor(x,y){
  let ret = "";
  const n = x.length;
  for(let i=0; i<n; i++){
    if(x[i] === '1' && y[i] === '0' || y[i] === '1' && x[i] === '0'){
      ret += "1";
    }
    else{
      ret += "0";
    }
  }
  return ret;
}

function quick_generate_keys(key){
  const roundKeys = [];
  const singlesh = new Set();
  const toadd = [1,2,9,16];
  let pc1_key = quick_pc1(key);
  let c = pc1_key.slice(0,28);
  let d = pc1_key.slice(28);
  for(let i = 0; i<4;i++){
    singlesh.add(toadd[i]);
  }
  for(let i = 0; i<16;i++){
    if(singlesh.has(i+1)){
      c = c.slice(1) + c.slice(0,1);
      d = d.slice(1) + d.slice(0,1);
    }
    else{
      c = c.slice(2) + c.slice(0,2);
      d = d.slice(2) + d.slice(0,2);
    }
    roundKeys.push(quick_pc2(c+d));
  }
  return roundKeys;
}

function quick_full_3des(inp,enc=true){
  let key1 = hexToBinary(document.getElementById("k"+1).value);
  let key2 = hexToBinary(document.getElementById("k"+2).value);
  let key3 = hexToBinary(document.getElementById("k"+3).value);
  const encoder = new TextEncoder(); // create a new TextEncoder object
  const prepared_inp = hexToBinary(inp,inp.length);
  let ret = "";
  if(enc===true){
    for(let i=0;i<prepared_inp.length;i+=64){
      let minp = prepared_inp.slice(i,i+64).padEnd(64,' ');
      let int1 = quick_des(minp,key1,true);
      let int2 = quick_des(int1,key2,false);
      let final = quick_des(int2,key3,true);
      ret += final;
    }
  }
  else{
    for(let i=0;i<prepared_inp.length;i+=64){
      let minp = prepared_inp.slice(i,i+64).padEnd(64,' ');
      let int1 = quick_des(minp,key3,false);
      let int2 = quick_des(int1,key2,true);
      let final = quick_des(int2,key1,false);
      ret += final;
    }
  }
  console.log(inp);
  console.log(inp.length);
  console.log(choppedString(prepared_inp,8));
  console.log(prepared_inp.length);
  console.log(choppedString(ret,8));
  console.log(ret.length);
  return binaryToHex(ret);
}

function quick_3des_begin(enc=true){
  let key1 = hexToBinary(document.getElementById("k"+1).value);
  let key2 = hexToBinary(document.getElementById("k"+2).value);
  let key3 = hexToBinary(document.getElementById("k"+3).value);
  let inp = hexToBinary(hexInp.slice(0,16));
  let int1 = quick_des(inp,key1,enc);
  let int2 = quick_des(int1,key2,!enc);
  let final = quick_des(int2,key3,enc);
  let int3 = quick_des(final,key3,!enc);
  let int4 = quick_des(int3,key2, enc);
  let rfinal= quick_des(int4,key1,!enc);
  /*
  console.log(binaryToHex(int1));
  console.log(binaryToHex(int2));
  console.log(binaryToHex(final));
  console.log(binaryToHex(int3));
  console.log(binaryToHex(int4));
  console.log(binaryToHex(rfinal));
  */
  set3DES([int1,int2,final,int3,int4,rfinal]);
  // console.log("PLAIN:   "+choppedString(plain,4));
  // console.log("KEY:     "+choppedString(key,4));
  // console.log("RESULT:  "+choppedString(result,4));
}

  return (
    <div>
      <div className="input-3des">
        <label htmlFor="inp_plaintext">Enter Plaintext:</label>
        <input className="nInput" type="text" id="inp_plaintext" name="inp_plaintext" placeholder="Input text" onChange={() => wordToHex(0)}></input>
        <input className="nInput wFile" type="file" id="inp_file" onChange={fileToHex} />
        <div className="nInput wHex">Hex: {hexInp.length > 16? hexInp.slice(0,16)+"... ("+hexInp.length/2+")" : hexInp}</div>
        <button className="nInput" disabled={animating} onClick={() => setKENC(true,visual3DES(true))}>Encrypt</button>
        <button className="nInput" disabled={animating} onClick={() => setKENC(false,visual3DES(false))}>Decrypt</button>
        <label className="nInput">
          <input type="checkbox" checked={dwn} onChange={handleDwnToggle} />
          Download Result
        </label>
      </div>
      <div className="input-3des">
        <label >Enter Keys (in Hex):</label>
        <input className="nInput" type="text" id="k1" name="k1" maxLength="16" placeholder="K1 (16 Characters)" defaultValue={""}/>
        <input className="nInput" type="text" id="k2" name="k2" maxLength="16" placeholder="K2 (16 Characters)" defaultValue={""}/>
        <input className="nInput" type="text" id="k3" name="k3" maxLength="16" placeholder="K3 (16 Characters)" defaultValue={""}/>
        <button className="nInput" onClick={() => randomKeys()}>Randomize</button>
        <p className="animslider" style={{marginLeft:"10px",marginRight:"10px"}}>Animation Speed: </p>
        <input disabled={animating} className="animslider" type="range" min="1" max="10" value={dSpeed} onChange={handleAnimSpeed} />
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
        ><div className="ab"><p>We will repeat these steps for subkeys {(k_enc===true)? "2 through 16" : "15 through 1 (roundkeys reversed in decryption)"}, using left shifts and the PC2 Matrix:</p></div>
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
        {mapper16.map((item, i) => (
          <div>
            <motion.div
            key={"K_text_N_"+(i+1)}
            initial={{ opacity: (kDisp >= (i+1))? 1.0 : 0.0,
                       x: 20, 
                       y: 70 + 20 * (i),}}
            animate={{ opacity: (kDisp >= (i+1))? 1.0 : 0.0}}
            transition={{ type: "tween", duration: durSpeed * 1.5}}
            id={"KTextN{"+i+"}"}
            ><div className="ab"><strong>Roundkey {i+1}:{`\t\t`}</strong></div>
          </motion.div>
            <motion.div
              key={"K_text_"+(i+1)}
              initial={{ opacity: (kDisp >= (i+1))? 1.0 : 0.0,
                         x: 150, 
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
          initial={{ opacity: (desDisp >= 1)? 1.0 : 0.0,
                    x: 20, 
                    y: 0 }}
          animate={{ opacity: (desDisp >= 1)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text0"}
          ><div className="ab"><p>Now we begin our DES encyption. We will need to get the left and rigth sides of the input, both being 32 bits:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp >= 20)? 1.0 : 0.0,
                    x: 20, 
                    y: 25 }}
          animate={{ opacity: (desDisp >= 20)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_TextL0"}
          ><div className="ab"><p>L0 = First Half of input ={`\t`}<strong>{choppedString(s_l0,4)}</strong></p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp >= 20)? 1.0 : 0.0,
                    x: 20, 
                    y: 45 }}
          animate={{ opacity: (desDisp >= 20)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_TextR0"}
          ><div className="ab"><p>R0 = Second Half of input ={`\t`}<strong>{choppedString(s_r0,4)}</strong></p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp >= 40)? 1.0 : 0.0,
                    x: 20, 
                    y: 80 }}
          animate={{ opacity: (desDisp >= 40)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text1"}
          ><div className="ab"><p>L[i] equals R[i-1]:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp >= 60)? 1.0 : 0.0,
                    x: 20, 
                    y: 105 }}
          animate={{ opacity: (desDisp >= 60)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_TextL1"}
          ><div className="ab"><p>L1 = R0 ={`        `}<strong>{choppedString(s_r0,4)}</strong></p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp >= 80)? 1.0 : 0.0,
                    x: 20, 
                    y: 140 }}
          animate={{ opacity: (desDisp >= 80)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text2"}
          ><div className="ab"><p>To get R1, we will first expand the L1 to 48 bits:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp >= 100)? 1.0 : 0.0,
                    x: 20, 
                    y: 185 }}
          animate={{ opacity: (desDisp >= 100)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_TextEXP"}
          ><div className="ab">
            <table className="tfix">
              <tbody>
                <tr>
                  <td className="first-column"></td>
                  {mapper48.map((col,idx) => (
                    <td className="w17 smaller-font" key={"t1i"+idx}>{idx+1}</td>
                  ))}
                </tr>
                <tr>
                  <td className="first-column">L1</td>
                  {mapper48.map((col,idx) => (
                    <td className={(desDisp>=140+idx*3 && desDisp<140+(idx+1)*3)? "w17 tfb tfcb" : "w17"} key={"t1l"+idx}>{s_r0[idx] ?? ""}</td>
                  ))}
                </tr>
                <tr className="bb">
                  <td className="first-column">E(L1) index</td>
                  {mapper48.map((col,idx) => (
                    <td className={(desDisp>=140+(e48[idx]-1)*3 && desDisp<140+e48[idx]*3)? "tfb tfcb w17 small-font" : "w17 small-font"} key={"t1k"+idx}>{e48[idx] ?? ""}</td>
                  ))}
                </tr>
                <tr>
                  <td className="first-column">Result</td>
                  {mapper48.map((col,idx) => (
                    <td className="w17" key={"t1el"+idx}>{(desDisp >= 140+(e48[idx]-1)*3)?s_el1[idx] ?? "" : ""}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp >= 250)? 1.0 : 0.0,
                    x: 20, 
                    y: 255 }}
          animate={{ opacity: (desDisp >= 250)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text2"}
          ><div className="ab"><p>Now, we will XOR the expanded L1 and the Subkey:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp >= 270)? 1.0 : 0.0,
                    x: 20, 
                    y: 300 }}
          animate={{ opacity: (desDisp >= 270)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_TextXOR"}
          ><div className="ab">
            <table className="tfix">
              <tbody>
                <tr>
                  <td className="first-column"></td>
                  {mapper48.map((col,idx) => (
                    <td className="w17 smaller-font" key={"t2i"+idx}>{idx+1}</td>
                  ))}
                </tr>
                <tr>
                  <td className="first-column">E(L1)</td>
                  {mapper48.map((col,idx) => (
                    <td className={(desDisp>=290+idx*2 && desDisp<290+(idx+1)*2)? "tfb tfcb w17" : "w17"} key={"t2el"+idx}>{s_el1[idx] ?? ""}</td>
                  ))}
                </tr>
                <tr className="bb">
                  <td className="first-column">Subkey 1</td>
                  {mapper48.map((col,idx) => (
                    <td className={(desDisp>=290+idx*2 && desDisp<290+(idx+1)*2)? "tfb tfcb w17" : "w17"} key={"t2k"+idx}>{key[1][idx] ?? ""}</td>
                  ))}
                </tr>
                <tr>
                  <td className="first-column">XOR Result</td>
                  {mapper48.map((col,idx) => (
                    <td className="w17 tfb" key={"t2xl"+idx}>{(desDisp >= 290+idx*2)?s_ker[idx] ?? "" : ""}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <div>
        <motion.div
          initial={{ opacity: (desDisp2 >= 1)? 1.0 : 0.0,
                    x: 20, 
                    y: 0 }}
          animate={{ opacity: (desDisp2 >= 1)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>After acquiring the XORed and expanded L1, we can now permutate it through our <strong><a target="_blank" href ="https://www.oreilly.com/library/view/computer-security-and/9780471947837/sec9.3.html">8 S-Boxes</a></strong>:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp2 >= 30)? 1.0 : 0.0,
                    x: 20, 
                    y: 45 }}
          animate={{ opacity: (desDisp2 >= 30)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_TextS_PERM"}
          ><div className="ab">
            <table className="tfix">
              <tbody>
                <tr>
                  <td className="first-column2">K(E(L1)) slices</td>
                  {mapper8.map((col,idx) => (
                    <td className="w120" key={"t3kel1-"+idx}>
                      <span className="tfcb">{s_ker.slice(idx*6,(idx*6)+1)}</span>
                      <span className="tfcr">{s_ker.slice(idx*6+1,(idx+1)*6-1)}</span>
                      <span className="tfcb">{s_ker.slice((idx+1)*6-1,(idx+1)*6)}</span>
                    </td>
                  ))}
                </tr>
                <tr className="bb">
                  <td className="first-column2">K(E(L1)) S-Box result</td>
                  {mapper8.map((col,idx) => (
                    <td className="w120" key={"t3kel2-"+idx}>
                      <span>S{idx+1}[</span>
                      <span className="tfcb">{slcData[idx][0]}</span>
                      <span>][</span>
                      <span className="tfcr">{slcData[idx][1]}</span>
                      <span>] = </span>
                      <span className="tfb">{slcData[idx][2]}</span>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="first-column2">K(E(L1)) Binary</td>
                  {mapper8.map((col,idx) => (
                    <td className="w120" key={"t3kel3-"+idx}><strong>{slcData[idx][3]}</strong></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp2 >= 80)? 1.0 : 0.0,
                    x: 20, 
                    y: 105 }}
          animate={{ opacity: (desDisp2 >= 80)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>S(K(E(L1))) = <strong>{choppedString(s_skel1,4)}</strong></p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp2 >= 100)? 1.0 : 0.0,
                    x: 20, 
                    y: 130 }}
          animate={{ opacity: (desDisp2 >= 100)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>Next, we have to permutate this value again:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp2 >= 120)? 1.0 : 0.0,
                    x: 20,
                    y: 175 }}
          animate={{ opacity: (desDisp2 >= 120)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_TextXOR2"}
          ><div className="ab">
            <table className="tfix">
              <tbody>
                <tr>
                  <td className="first-column"></td>
                  {mapper32.map((col,idx) => (
                    <td className="w17 smaller-font" key={"t4i"+idx}>{idx+1}</td>
                  ))}
                </tr>
                <tr>
                  <td className="first-column">S(K(E(L1)))</td>
                  {mapper32.map((col,idx) => (
                    <td className={(desDisp2>=140+idx*2 && desDisp2<140+(idx+1)*2)? "tfb tfcb w17"  : "w17"} key={"t4pr"+idx}>{s_pr1[idx] ?? ""}</td>
                  ))}
                </tr>
                <tr className="bb">
                  <td className="first-column">P-index</td>
                  {mapper32.map((col,idx) => (
                    <td className={(desDisp2>=140+(p_perm[idx]-1)*2 && desDisp2<140+(p_perm[idx]*2))? "tfb tfcb w17 small-font" : "small-font w17"} key={"t4p"+idx}>{p_perm[idx] ?? ""}</td>
                  ))}
                </tr>
                <tr>
                  <td className="first-column">Result</td>
                  {mapper32.map((col,idx) => (
                    <td className="w17" key={"t4r"+idx}>{(desDisp2 >= 140+(p_perm[idx]-1)*2)?s_pker[idx] ?? "" : ""}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp2 >= 240)? 1.0 : 0.0,
                    x: 20, 
                    y: 245 }}
          animate={{ opacity: (desDisp2 >= 240)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>Now to finally get R1, we will XOR this binary string we just found with L0:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (desDisp2 >= 260)? 1.0 : 0.0,
                    x: 20, 
                    y: 290 }}
          animate={{ opacity: (desDisp2 >= 260)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_TextXOR2"}
          ><div className="ab">
            <table className="tfix">
              <tbody>
                <tr>
                  <td className="first-column"></td>
                  {mapper32.map((col,idx) => (
                    <td className="w17 smaller-font" key={"t5i"+idx}>{idx+1}</td>
                  ))}
                </tr>
                <tr>
                  <td className="first-column">P(S(K(E(L1))))</td>
                  {mapper32.map((col,idx) => (
                    <td className={(desDisp2>=280+idx*2 && desDisp2<280+(idx+1)*2)? "tfb tfcb w17" : "w17"} key={"t5pr"+idx}>{s_pr1[idx] ?? ""}</td>
                  ))}
                </tr>
                <tr className="bb">
                  <td className="first-column">L0</td>
                  {mapper32.map((col,idx) => (
                    <td className={(desDisp2>=280+idx*2 && desDisp2<280+(idx+1)*2)? "tfb tfcb w17" : "w17"} key={"t5l"+idx}>{s_l0[idx] ?? ""}</td>
                  ))}
                </tr>
                <tr>
                  <td className="first-column">XOR Result</td>
                  {mapper32.map((col,idx) => (
                    <td className="w17" key={"t5xr"+idx}><strong>{(desDisp2 >= 280+idx*2)?s_r1[idx] ?? "" : ""}</strong></td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
      <div>
        <motion.div
          initial={{ opacity: (desDisp16 >= 1)? 1.0 : 0.0,
                    x: 20, 
                    y: 0 }}
          animate={{ opacity: (desDisp16>= 1)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>We will repeat those steps for 16 full rounds:</p></div>
        </motion.div>
        {mapper16.map((col, idx) => (
          <div>
            <motion.div
            initial={{ opacity: (desDisp16 >= 8*(idx+1))? 1.0 : 0.0,
                      x: 20, 
                      y: 25+20*idx }}
            animate={{ opacity: (desDisp16>= 8*(idx+1))? 1.0 : 0.0}}
            transition={{ type: "tween", duration: durSpeed * 1.5}}
            id={"DES_info_Text16-"+idx}
            >
              <div className={(idx===15)?"ab tfb" : "ab"}>
                <p><strong>L{idx+1}: </strong>{choppedString(s_int[idx][0],4)}</p>
              </div>
          </motion.div>
          <motion.div
          initial={{ opacity: (desDisp16 >= 8*(idx+1))? 1.0 : 0.0,
                    x: 420, 
                    y: 25+20*idx }}
          animate={{ opacity: (desDisp16>= 8*(idx+1))? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text16-"+idx}
          >
            <div className={(idx===15)?"ab tfb" : "ab"}>
              <p><strong>R{idx+1}: </strong>{choppedString(s_int[idx][1],4)}</p>
            </div>
          </motion.div>
        </div>
        ))}
        <motion.div
          initial={{ opacity: (desDisp16 >= 150)? 1.0 : 0.0,
                    x: 20, 
                    y: 350 }}
          animate={{ opacity: (desDisp16>= 150)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text100"}
          >
            <div className="ab">
              <p>The string we take to the final permutation is R[16]+L[16]:</p>
            </div>
          </motion.div>
          <motion.div
          initial={{ opacity: (desDisp16 >= 170)? 1.0 : 0.0,
                    x: 20, 
                    y: 370 }}
          animate={{ opacity: (desDisp16>= 170)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text200"}
          >
            <div className="ab">
              <p><strong>{choppedString(s_int[15][1]+s_int[15][0],4)}</strong></p>
            </div>
          </motion.div>
      </div>
      <div className={(kenc===true)? "" : "hInput"}>
        <motion.div
          initial={{ opacity: (des3 >= 1)? 1.0 : 0.0,
                    x: 20, 
                    y: 0 }}
          animate={{ opacity: (des3>= 1)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>This is only one iteration of DES:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 20)? 1.0 : 0.0,
                    x: 20, 
                    y: 25 }}
          animate={{ opacity: (des3>= 20)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>E<sub>K1</sub>(text): {binaryToHex(tdes_result[0])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 20)? 1.0 : 0.0,
                    x: 400, 
                    y: 25 }}
          animate={{ opacity: (des3>= 20)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: {binaryToAscii(tdes_result[0])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 50)? 1.0 : 0.0,
                    x: 20, 
                    y: 60 }}
          animate={{ opacity: (des3>= 1)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>We still need to peform operations using the other 2 keys:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 70)? 1.0 : 0.0,
                    x: 20, 
                    y: 85 }}
          animate={{ opacity: (des3>= 70)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>D<sub>K2</sub>(E<sub>K1</sub>(text)): {binaryToHex(tdes_result[1])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 70)? 1.0 : 0.0,
                    x: 400, 
                    y: 85 }}
          animate={{ opacity: (des3>= 70)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: {binaryToAscii(tdes_result[1])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 85)? 1.0 : 0.0,
                    x: 20, 
                    y: 105 }}
          animate={{ opacity: (des3>= 85)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>E<sub>K3</sub>(D<sub>K2</sub>(E<sub>K1</sub>(text))): {binaryToHex(tdes_result[2])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 85)? 1.0 : 0.0,
                    x: 400, 
                    y: 105 }}
          animate={{ opacity: (des3>= 85)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: <strong>{binaryToAscii(tdes_result[2])}</strong></p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 110)? 1.0 : 0.0,
                    x: 20, 
                    y: 130 }}
          animate={{ opacity: (des3>= 110)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>Now to decrypt it back to check for validity:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 130)? 1.0 : 0.0,
                    x: 20, 
                    y: 155 }}
          animate={{ opacity: (des3>= 130)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>D<sub>K3</sub>(ciph): {binaryToHex(tdes_result[3])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 130)? 1.0 : 0.0,
                    x: 400, 
                    y: 155 }}
          animate={{ opacity: (des3>= 130)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: {binaryToAscii(tdes_result[3])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 145)? 1.0 : 0.0,
                    x: 20, 
                    y: 175 }}
          animate={{ opacity: (des3>= 145)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>E<sub>K2</sub>(D<sub>K3</sub>(ciph)): {binaryToHex(tdes_result[4])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 145)? 1.0 : 0.0,
                    x: 400, 
                    y: 175 }}
          animate={{ opacity: (des3>= 145)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: {binaryToAscii(tdes_result[4])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 160)? 1.0 : 0.0,
                    x: 20, 
                    y: 195 }}
          animate={{ opacity: (des3>= 160)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>D<sub>K1</sub>(E<sub>K2</sub>(D<sub>K3</sub>(ciph))): {binaryToHex(tdes_result[5])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 160)? 1.0 : 0.0,
                    x: 400, 
                    y: 195 }}
          animate={{ opacity: (des3>= 160)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: <strong>{binaryToAscii(tdes_result[5])}</strong></p></div>
        </motion.div>
      </div>
      <div className={(kenc===false)? "" : "hInput"}>
        <motion.div
          initial={{ opacity: (des3 >= 1)? 1.0 : 0.0,
                    x: 20, 
                    y: 0 }}
          animate={{ opacity: (des3>= 1)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>This is only one iteration of DES:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 20)? 1.0 : 0.0,
                    x: 20, 
                    y: 25 }}
          animate={{ opacity: (des3>= 20)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>D<sub>K3</sub>(text): {binaryToHex(tdes_result[0])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 20)? 1.0 : 0.0,
                    x: 400, 
                    y: 25 }}
          animate={{ opacity: (des3>= 20)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: {binaryToAscii(tdes_result[0])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 50)? 1.0 : 0.0,
                    x: 20, 
                    y: 60 }}
          animate={{ opacity: (des3>= 1)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>We still need to peform operations using the other 2 keys:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 70)? 1.0 : 0.0,
                    x: 20, 
                    y: 85 }}
          animate={{ opacity: (des3>= 70)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>E<sub>K2</sub>(D<sub>K3</sub>(text)): {binaryToHex(tdes_result[1])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 70)? 1.0 : 0.0,
                    x: 400, 
                    y: 85 }}
          animate={{ opacity: (des3>= 70)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: {binaryToAscii(tdes_result[1])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 85)? 1.0 : 0.0,
                    x: 20, 
                    y: 105 }}
          animate={{ opacity: (des3>= 85)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>D<sub>K1</sub>(E<sub>K2</sub>(D<sub>K3</sub>(text))): {binaryToHex(tdes_result[2])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 85)? 1.0 : 0.0,
                    x: 400, 
                    y: 105 }}
          animate={{ opacity: (des3>= 85)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: <strong>{binaryToAscii(tdes_result[2])}</strong></p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 110)? 1.0 : 0.0,
                    x: 20, 
                    y: 130 }}
          animate={{ opacity: (des3>= 110)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>Now to encrypt it back to check for validity:</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 130)? 1.0 : 0.0,
                    x: 20, 
                    y: 155 }}
          animate={{ opacity: (des3>= 130)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>E<sub>K1</sub>(ciph): {binaryToHex(tdes_result[3])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 130)? 1.0 : 0.0,
                    x: 400, 
                    y: 155 }}
          animate={{ opacity: (des3>= 130)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: {binaryToAscii(tdes_result[3])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 145)? 1.0 : 0.0,
                    x: 20, 
                    y: 175 }}
          animate={{ opacity: (des3>= 145)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>D<sub>K2</sub>(E<sub>K1</sub>(ciph)): {binaryToHex(tdes_result[4])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 145)? 1.0 : 0.0,
                    x: 400, 
                    y: 175 }}
          animate={{ opacity: (des3>= 145)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: {binaryToAscii(tdes_result[4])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 160)? 1.0 : 0.0,
                    x: 20, 
                    y: 195 }}
          animate={{ opacity: (des3>= 160)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>E<sub>K3</sub>(D<sub>K2</sub>(E<sub>K1</sub>(ciph))): {binaryToHex(tdes_result[5])}</p></div>
        </motion.div>
        <motion.div
          initial={{ opacity: (des3 >= 160)? 1.0 : 0.0,
                    x: 400, 
                    y: 195 }}
          animate={{ opacity: (des3>= 160)? 1.0 : 0.0}}
          transition={{ type: "tween", duration: durSpeed * 1.5}}
          id={"DES_info_Text10"}
          ><div className="ab"><p>ASCII: <strong>{binaryToAscii(tdes_result[5])}</strong></p></div>
        </motion.div>
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
        <h3>Enter your input to begin.</h3>
        <p>3DES/DES encrypts data in 64-bit "blocks." For the visualization, we will only encrypt one block.</p>  
        <p>To skip the animation and download the resulting plain/cipher, toggle the "Download Result" option.</p>  
        <p>Note that the downloaded result WILL include the full length of the input, and the resulting file will contain as a hex value.</p> 
        <hr/>
        <h4>To upload a file as input:</h4>   
        <p>Click the "Choose File" button and select your desired file.</p> 
        <p>If successful, the Hex and Plaintext fields should update, and you are ready to encrypt/decrypt!</p>
        <p className="tfcb">{(dtime!==-1.0)? "Done! 3DES took "+dtime+" seconds." : ""}</p>
      </div>
    </div>
  )
}

export default Visual3DES;
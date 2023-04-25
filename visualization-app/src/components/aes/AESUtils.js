const rcon = function () {
  return [
    [0x01, 0x00, 0x00, 0x00],
    [0x02, 0x00, 0x00, 0x00],
    [0x04, 0x00, 0x00, 0x00],
    [0x08, 0x00, 0x00, 0x00],
    [0x10, 0x00, 0x00, 0x00],
    [0x20, 0x00, 0x00, 0x00],
    [0x40, 0x00, 0x00, 0x00],
    [0x80, 0x00, 0x00, 0x00],
    [0x1b, 0x00, 0x00, 0x00],
    [0x36, 0x00, 0x00, 0x00],
  ];
};

const sbox = function () {
  return [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
    0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
    0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26,
    0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
    0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
    0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed,
    0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
    0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
    0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec,
    0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
    0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
    0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d,
    0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
    0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
    0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
    0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
    0xb0, 0x54, 0xbb, 0x16,
  ];
};

const mix_col_mat = function () {
  return [
    [2, 3, 1, 1],
    [1, 2, 3, 1],
    [1, 1, 2, 3],
    [3, 1, 1, 2],
  ];
};

const in_sbox = function (hex) {
  let index;
  let s_box = sbox();
  if (hex.length === 1) {
    index = hex;
  } else {
    const row = parseInt(hex[0], 16);
    const col = parseInt(hex[1], 16);
    index = row * 16 + col;
  }

  return s_box[index];
};

const text_to_hexadecimal = function (text) {
  const hex = [];
  for (let i = 0; i < text.length; i++) {
    const hexChar = text.charCodeAt(i).toString(16);
    hex.push(hexChar);
  }
  return hex;
};

const random_hex_array = function (num_values) {
  const hexArray = [];
  for (let i = 0; i < num_values; i++) {
    const randomHex = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    hexArray.push(randomHex);
  }
  return hexArray;
};

const pad_arr = function (arr, max_len, pad_elem) {
  while (arr.length < max_len) {
    arr.push(pad_elem); // 5a
  }
  return arr;
};

const array_to_matrix = function (arr) {
  const matrix = [];
  for (let i = 0; i < 4; i++) {
    matrix.push(arr.slice(i * 4, i * 4 + 4));
  }
  return matrix;
};

const text_to_hex_array = function (text) {
  const hexArray = [];
  for (let i = 0; i < text.length; i++) {
    hexArray.push(text.charCodeAt(i).toString(16));
  }
  return hexArray;
};

const is_hex_arr_valid = function (hex_arr) {
  for (let i = 0; i < hex_arr.length; i++) {
    const hexString = hex_arr[i];
    if (!/^[0-9a-fA-F]+$/.test(hexString)) {
      return false;
    }
  }
  return true;
};

const getColumn = function (matrix, n) {
  const column = [];
  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i];
    column.push(row[n]);
  }
  return column;
};

const xor_hex = function (hexArray1, hexArray2) {
  const uint8arr1 = new Uint8Array(hexArray1.map((hex) => parseInt(hex, 16)));
  const uint8arr2 = new Uint8Array(hexArray2.map((hex) => parseInt(hex, 16)));
  const xorResult = new Uint8Array(uint8arr1.length);
  for (let i = 0; i < uint8arr1.length; i++) {
    xorResult[i] = uint8arr1[i] ^ uint8arr2[i];
  }
  const hexResult = [];
  for (let i = 0; i < xorResult.length; i++) {
    let hex = xorResult[i].toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    hexResult.push(hex);
  }
  return hexResult;
};

function add_col_to_mat(mat, col) {
  if (mat.length === 0) {
    return col.map((val) => [val]);
  }

  const result = new Array(mat.length);
  for (let i = 0; i < mat.length; i++) {
    result[i] = [...mat[i], col[i]];
  }
  return result;
}

const mul = function (a, b) {
  if (a === 0x01) {
    return b;
  } else if (a === 0x02) {
    return mul2(b);
  } else if (a === 0x03) {
    return mul3(b);
  }
};

const mul2 = function (a) {
  if (a < 0x80) {
    return a << 1;
  } else {
    return ((a << 1) ^ 0x1b) % 0x100;
  }
};

const mul3 = function (a) {
  return mul2(a) ^ a;
};

const mul_arr_mat = function (arr, matrix) {
  var result = [];
  for (var i = 0; i < matrix.length; i++) {
    var sum = 0;
    for (var j = 0; j < arr.length; j++) {
      sum += matrix[i][j] * arr[j];
    }
    var hexString = Math.round(sum).toString(16);
    if (hexString.length % 2 === 1) {
      hexString = '0' + hexString;
    }
    result.push(hexString);
  }
  return result;
};

// 2b 28 ab 09 7e ae f7 cf 15 d2 15 4f 16 a6 88 3c
const create_key_schedule = function (cipher_key_matrix) {
  const r_con = rcon();
  let key_schedule = cipher_key_matrix;
  for (let i = 0; i < r_con.length; i++) {
    for (let x = 0; x < 4; x++) {
      if (x === 0) {
        const r_con_i = r_con[i];
        let rot_word = getColumn(key_schedule, key_schedule[0].length - 1);
        rot_word.push(rot_word.shift());
        for (let e = 0; e < rot_word.length; e++) {
          rot_word[e] = in_sbox(rot_word[e].toString(16)).toString(16);
        }
        const prev_col = getColumn(key_schedule, key_schedule[0].length - 4);
        const result_xor = xor_hex(r_con_i, xor_hex(rot_word, prev_col));
        key_schedule = add_col_to_mat(key_schedule, result_xor);
      } else {
        let rot_word = getColumn(key_schedule, key_schedule[0].length - 1);
        const prev_col = getColumn(key_schedule, key_schedule[0].length - 4);
        const result_xor = xor_hex(rot_word, prev_col);
        key_schedule = add_col_to_mat(key_schedule, result_xor);
      }
    }
  }

  return key_schedule;
};

const get_round_key = function (key_schedule, n) {
  const startIndex = (n - 1) * 4;
  const endIndex = startIndex + 4;
  return key_schedule.slice(0).map((row) => row.slice(startIndex, endIndex));
};

const shift_array_left = function (arr, n) {
  const numShifts = n % arr.length;
  for (let i = 0; i < numShifts; i++) {
    const firstElement = arr.shift();
    arr.push(firstElement);
  }
  return arr;
};

const add_round_key = function (matrix, round_key) {
  let result_mat = [];
  for (let i = 0; i < matrix[0].length; i++) {
    const current_mat_col = getColumn(matrix, i);
    const current_key_col = getColumn(round_key, i);
    const hex_xor_res = xor_hex(current_mat_col, current_key_col);
    result_mat = add_col_to_mat(result_mat, hex_xor_res);
  }
  return result_mat;
};

const sub_bytes = function (matrix) {
  let temp_mat = JSON.parse(JSON.stringify(matrix.slice()));
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      temp_mat[i][j] = in_sbox(matrix[i][j].toString(16)).toString(16);
    }
  }
  return temp_mat;
};

const shift_rows = function (matrix) {
  let temp_mat = JSON.parse(JSON.stringify(matrix.slice()));
  for (let i = 1; i < matrix.length; i++) {
    temp_mat[i] = shift_array_left(temp_mat[i], i);
  }
  return temp_mat;
};

const transpose = function (matrix) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
};

const mix_columns = function (matrix) {
  const newMatrix = [];

  for (let col = 0; col < 4; col++) {
    const column = matrix.map((row) => parseInt(row[col], 16));
    const newColumn = [];

    newColumn[0] = (
      mul(0x02, column[0]) ^
      mul(0x03, column[1]) ^
      column[2] ^
      column[3]
    )
      .toString(16)
      .padStart(2, '0');
    newColumn[1] = (
      column[0] ^
      mul(0x02, column[1]) ^
      mul(0x03, column[2]) ^
      column[3]
    )
      .toString(16)
      .padStart(2, '0');
    newColumn[2] = (
      column[0] ^
      column[1] ^
      mul(0x02, column[2]) ^
      mul(0x03, column[3])
    )
      .toString(16)
      .padStart(2, '0');
    newColumn[3] = (
      mul(0x03, column[0]) ^
      column[1] ^
      column[2] ^
      mul(0x02, column[3])
    )
      .toString(16)
      .padStart(2, '0');

    newMatrix.push(newColumn);
  }

  return transpose(newMatrix);
};

export {
  rcon,
  sbox,
  in_sbox,
  text_to_hexadecimal,
  random_hex_array,
  array_to_matrix,
  pad_arr,
  text_to_hex_array,
  is_hex_arr_valid,
  create_key_schedule,
  add_round_key,
  get_round_key,
  sub_bytes,
  shift_rows,
  mul_arr_mat,
  mix_col_mat,
  mix_columns,
};

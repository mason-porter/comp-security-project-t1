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
export {
  text_to_hex_array,
  is_hex_arr_valid,
  };
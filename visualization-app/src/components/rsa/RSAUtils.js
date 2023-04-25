/* global BigInt */

const calculate_gcd = function (a, b) {
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a;
};

const is_number_prime = function (num) {
  for (let i = 2, sqrt = Math.sqrt(num); i <= sqrt; i++) {
    if (num % i === 0) {
      return false;
    }
  }

  return true;
};

const generate_p_q_n = function () {
  let p = (Math.floor(Math.random() * 700) + 300) | 1;
  let q = (Math.floor(Math.random() * 700) + 300) | 1;

  while (!is_number_prime(p) || !is_number_prime(q) || p === q) {
    p = (Math.floor(Math.random() * 700) + 300) | 1;
    q = (Math.floor(Math.random() * 700) + 300) | 1;
  }

  const n = p * q;

  return [p, q, n];
};

const generate_totient_of_n = function (p, q) {
  const n = p * q;
  const tot_n = n - p - q + 1;

  return tot_n;
};

const generate_public_key = function (p, q) {
  const n = p * q;
  const totient_of_n = generate_totient_of_n(p, q);

  let e = 2;
  while (e < n) {
    if (calculate_gcd(e, totient_of_n) === 1) {
      return e;
    }
    e += 1;
  }

  // No valid public key has been found.
  return -1;
};

const generate_private_key = function (p, q, e) {
  const totient_of_n = generate_totient_of_n(p, q);

  let d = 1;
  while ((e * d) % totient_of_n !== 1) {
    d++;
  }
  return d;
};

const string_to_plaintext_chars = function (string) {
  const output = [];
  for (let i = 0; i < string.length; i++) {
    const charCode = string.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      output.push(charCode - 65);
    } else if (charCode >= 97 && charCode <= 122) {
      output.push(charCode - 97);
    } else if (charCode === 32) {
      output.push(26);
    }
  }
  return output;
};

const plaintext_chars_to_string = function (plaintext_chars) {
  const string = [];
  for (let i = 0; i < plaintext_chars.length; i++) {
    const number = plaintext_chars[i];
    if (number === 26) {
      string.push(' ');
    } else {
      const charCode = number + 97;
      string.push(String.fromCharCode(charCode));
    }
  }
  return string.join('');
};

const encrypt = function (
  mode,
  plaintext_chars,
  sender_public,
  sender_private,
  receiver_public,
  receiver_private,
  sender_n,
  receiver_n
) {
  let encrypted_plaintext_chars = [];
  if (mode === 'ci') {
    for (let i = 0; i < plaintext_chars.length; i++) {
      const char = plaintext_chars[i];
      const char_enc = parseInt(
        (BigInt(char) ** BigInt(sender_private) % BigInt(sender_n)) **
          BigInt(receiver_public) %
          BigInt(receiver_n)
      );
      encrypted_plaintext_chars.push(char_enc);
    }
  } else if (mode === 'confidentiality') {
    for (let i = 0; i < plaintext_chars.length; i++) {
      const char = plaintext_chars[i];
      const char_enc = parseInt(
        BigInt(char) ** BigInt(receiver_public) % BigInt(receiver_n)
      );
      encrypted_plaintext_chars.push(char_enc);
    }
  } else {
    for (let i = 0; i < plaintext_chars.length; i++) {
      const char = plaintext_chars[i];
      const char_enc = parseInt(
        BigInt(char) ** BigInt(sender_private) % BigInt(sender_n)
      );
      encrypted_plaintext_chars.push(char_enc);
    }
  }

  return encrypted_plaintext_chars;
};

const decrypt = function (
  mode,
  plaintext_chars,
  sender_public,
  sender_private,
  receiver_public,
  receiver_private,
  sender_n,
  receiver_n
) {
  let decrypted_plaintext_chars = [];
  if (mode === 'ci') {
    for (let i = 0; i < plaintext_chars.length; i++) {
      const char = plaintext_chars[i];
      const char_enc = parseInt(
        (BigInt(char) ** BigInt(receiver_private) % BigInt(receiver_n)) **
          BigInt(sender_public) %
          BigInt(sender_n)
      );
      decrypted_plaintext_chars.push(char_enc);
    }
  } else if (mode === 'confidentiality') {
    for (let i = 0; i < plaintext_chars.length; i++) {
      const char = plaintext_chars[i];
      const char_enc = parseInt(
        BigInt(char) ** BigInt(receiver_private) % BigInt(receiver_n)
      );
      decrypted_plaintext_chars.push(char_enc);
    }
  } else {
    for (let i = 0; i < plaintext_chars.length; i++) {
      const char = plaintext_chars[i];
      const char_enc = parseInt(
        BigInt(char) ** BigInt(sender_public) % BigInt(sender_n)
      );
      decrypted_plaintext_chars.push(char_enc);
    }
  }

  return decrypted_plaintext_chars;
};

export {
  is_number_prime,
  generate_p_q_n,
  generate_totient_of_n,
  generate_public_key,
  generate_private_key,
  calculate_gcd,
  string_to_plaintext_chars,
  plaintext_chars_to_string,
  encrypt,
  decrypt,
};

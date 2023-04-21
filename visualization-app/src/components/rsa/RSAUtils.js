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
  let p = (Math.floor(Math.random() * 300) + 100) | 1;
  let q = (Math.floor(Math.random() * 300) + 100) | 1;

  while (!is_number_prime(p) || !is_number_prime(q) || p === q) {
    p = (Math.floor(Math.random() * 300) + 100) | 1;
    q = (Math.floor(Math.random() * 300) + 100) | 1;
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

const generate_private_key = function (p, q) {
  const totient_of_n = generate_totient_of_n(p, q);
  const e = generate_public_key(p, q);

  let d = 1;
  while ((e * d) % totient_of_n !== 1) {
    d++;
  }
  return d;
};

export {
  generate_p_q_n,
  generate_totient_of_n,
  generate_public_key,
  generate_private_key,
};

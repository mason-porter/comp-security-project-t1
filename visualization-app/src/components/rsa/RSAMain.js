import { Component } from 'react';
import * as RSAUtils from './RSAUtils';
import './RSA.css';

class RSAMain extends Component {
  constructor() {
    super();

    this.sender_p_q_n = RSAUtils.generate_p_q_n();
    this.receiver_p_q_n = RSAUtils.generate_p_q_n();
    this.sender_p = this.sender_p_q_n[0];
    this.receiver_p = this.receiver_p_q_n[0];
    this.sender_q = this.sender_p_q_n[1];
    this.receiver_q = this.receiver_p_q_n[1];
    this.sender_n = this.sender_p_q_n[2];
    this.receiver_n = this.receiver_p_q_n[2];
    this.sender_totient_of_n = RSAUtils.generate_totient_of_n(
      this.sender_p,
      this.sender_q
    );
    this.receiver_totient_of_n = RSAUtils.generate_totient_of_n(
      this.receiver_p,
      this.receiver_q
    );
    this.sender_public_key = RSAUtils.generate_public_key(
      this.sender_p,
      this.sender_q
    );
    this.receiver_public_key = RSAUtils.generate_public_key(
      this.receiver_p,
      this.receiver_q
    );
    this.sender_private_key = RSAUtils.generate_private_key(
      this.sender_p,
      this.sender_q,
      this.sender_public_key
    );
    this.receiver_private_key = RSAUtils.generate_private_key(
      this.receiver_p,
      this.receiver_q,
      this.receiver_public_key
    );

    this.state = {
      sender_p: this.sender_p,
      receiver_p: this.receiver_p,
      sender_q: this.sender_q,
      receiver_q: this.receiver_q,
      sender_n: this.sender_n,
      receiver_n: this.receiver_n,
      sender_p_q_n: this.sender_p_q_n,
      receiver_p_q_n: this.receiver_p_q_n,
      sender_totient_of_n: this.sender_totient_of_n,
      receiver_totient_of_n: this.receiver_totient_of_n,
      sender_public_key: this.sender_public_key,
      receiver_public_key: this.receiver_public_key,
      sender_private_key: this.sender_private_key,
      receiver_private_key: this.receiver_private_key,
      sender_errorText: '',
      receiver_errorText: '',
      errorText: '',
      dataToEncrypt: '',
      dataTypeForEncryption: 'text',
      modeOfEncryption: 'ci',
      split_data: [],
      encrypted_plaintext_chars: [],
      decrypted_plaintext_chars: [],
    };
  }

  handleChangeSenderP(e) {
    this.setState({ sender_p: e.target.value ? parseInt(e.target.value) : '' });
  }

  handleChangeSenderQ(e) {
    this.setState({ sender_q: e.target.value ? parseInt(e.target.value) : '' });
  }

  handleChangeSenderE(e) {
    this.setState({
      sender_public_key: e.target.value ? parseInt(e.target.value) : '',
    });
  }

  handleChangeSenderD(e) {
    this.setState({
      sender_private_key: e.target.value ? parseInt(e.target.value) : '',
    });
  }

  handleChangeReceiverP(e) {
    this.setState({
      receiver_p: e.target.value ? parseInt(e.target.value) : '',
    });
  }

  handleChangeReceiverQ(e) {
    this.setState({
      receiver_q: e.target.value ? parseInt(e.target.value) : '',
    });
  }

  handleChangeReceiverE(e) {
    this.setState({
      receiver_public_key: e.target.value ? parseInt(e.target.value) : '',
    });
  }

  handleChangeReceiverD(e) {
    this.setState({
      receiver_private_key: e.target.value ? parseInt(e.target.value) : '',
    });
  }

  handleChangeDataToEncrypt(e) {
    this.setState({ dataToEncrypt: e.target.value });
  }

  handleChangeDataTypeForEncr(e) {
    this.setState({ dataTypeForEncryption: e.target.value });
  }

  handleChangeModeOfEncr(e) {
    this.setState({ modeOfEncryption: e.target.value });
  }

  handleValidation() {
    // Verify p is present and is a prime number.
    if (!this.state.sender_p) {
      this.setState({
        sender_errorText: 'First prime number (p) not provided',
      });
      return;
    }
    if (!RSAUtils.is_number_prime(this.state.sender_p)) {
      this.setState({
        sender_errorText: 'First prime number (p) not a prime number',
      });
      return;
    }
    if (!this.state.receiver_p) {
      this.setState({
        receiver_errorText: 'First prime number (p) not provided',
      });
      return;
    }
    if (!RSAUtils.is_number_prime(this.state.receiver_p)) {
      this.setState({
        receiver_errorText: 'First prime number (p) not a prime number',
      });
      return;
    }

    // Verify q is present and is a prime number.
    if (!this.state.sender_q) {
      this.setState({
        sender_errorText: 'Second prime number (q) not provided',
      });
      return;
    }
    if (!RSAUtils.is_number_prime(this.state.sender_q)) {
      this.setState({
        sender_errorText: 'Second prime number (q) not a prime number',
      });
      return;
    }
    if (!this.state.receiver_q) {
      this.setState({
        receiver_errorText: 'Second prime number (q) not provided',
      });
      return;
    }
    if (!RSAUtils.is_number_prime(this.state.receiver_q)) {
      this.setState({
        receiver_errorText: 'Second prime number (q) not a prime number',
      });
      return;
    }

    // Recalculate n and totient of n.
    this.setState({ sender_n: this.state.sender_p * this.state.sender_q });
    this.setState({
      sender_totient_of_n: RSAUtils.generate_totient_of_n(
        this.state.sender_p,
        this.state.sender_q
      ),
    });
    this.setState({
      receiver_n: this.state.receiver_p * this.state.receiver_q,
    });
    this.setState({
      receiver_totient_of_n: RSAUtils.generate_totient_of_n(
        this.state.receiver_p,
        this.state.receiver_q
      ),
    });

    // Ensure that e<n and is relatively prime to the totient of n.
    if (!this.state.sender_public_key) {
      this.setState({ sender_errorText: 'Public key (e) not provided' });
      return;
    }
    if (this.state.sender_public_key >= this.state.sender_n) {
      this.setState({ sender_errorText: 'Public key (e) is not less than n' });
      return;
    }
    if (
      RSAUtils.calculate_gcd(
        this.state.sender_public_key,
        this.state.sender_totient_of_n
      ) !== 1
    ) {
      this.setState({
        sender_errorText:
          'Public key (e) is not relatively prime to the totient of n (Φ(n))',
      });
      return;
    }
    if (!this.state.receiver_public_key) {
      this.setState({ receiver_errorText: 'Public key (e) not provided' });
      return;
    }
    if (this.state.receiver_public_key >= this.state.sender_n) {
      this.setState({
        receiver_errorText: 'Public key (e) is not less than n',
      });
      return;
    }
    if (
      RSAUtils.calculate_gcd(
        this.state.receiver_public_key,
        this.state.receiver_totient_of_n
      ) !== 1
    ) {
      this.setState({
        receiver_errorText:
          'Public key (e) is not relatively prime to the totient of n (Φ(n))',
      });
      return;
    }

    // Ensure that e*d mod Φ(n) = 1
    if (!this.state.sender_private_key) {
      this.setState({ sender_errorText: 'Private key (d) not provided' });
      return;
    }
    if (
      (this.state.sender_public_key * this.state.sender_private_key) %
        this.state.sender_totient_of_n !==
      1
    ) {
      this.setState({
        sender_errorText:
          'Private key not valid. e*d mod Φ(n) is not equal to 1',
      });
      return;
    }
    if (!this.state.receiver_private_key) {
      this.setState({ receiver_errorText: 'Private key (d) not provided' });
      return;
    }
    if (
      (this.state.receiver_public_key * this.state.receiver_private_key) %
        this.state.receiver_totient_of_n !==
      1
    ) {
      this.setState({
        receiver_errorText:
          'Private key not valid. e*d mod Φ(n) is not equal to 1',
      });
      return;
    }
    // Ensure that data to encrypt is present
    if (!this.state.dataToEncrypt) {
      this.setState({ errorText: 'No data to encrypt' });
      return;
    }
    // Ensure that there is data type for encryption
    if (!this.state.dataTypeForEncryption) {
      this.setState({ errorText: 'No data type for encryption' });
      return;
    }
    // If the data type for encryption is plaintext chars, ensure it is provided
    // in the correct format.
    var joined_split_data = [];
    if (this.state.dataTypeForEncryption !== 'text') {
      let splitData = this.state.dataToEncrypt.split(' ');
      for (let i = 0; i < splitData.length; i++) {
        const data = splitData[i];
        if (!isNaN(data)) {
          let dataInt = parseInt(data);
          if (dataInt < 0 || dataInt > 26) {
            this.setState({
              errorText:
                'Data to encrypt should be plaintext characters between 00 and 26',
            });
            return;
          }
          joined_split_data.push(dataInt);
        } else {
          this.setState({
            errorText:
              'Data to encrypt should be plaintext characters between 00 and 26',
          });
          return;
        }
      }
      this.setState({ split_data: joined_split_data });
    } else {
      if (/[^a-zA-Z ]/.test(this.state.dataToEncrypt)) {
        this.setState({
          errorText: 'Data to encrypt cannot contain non-letters',
        });
        return;
      }
      this.setState({
        split_data: RSAUtils.string_to_plaintext_chars(
          this.state.dataToEncrypt
        ),
      });
    }
    // Ensure that there is a mode for encryption/decryption
    if (!this.state.modeOfEncryption) {
      this.setState({ errorText: 'No mode of encryption/decryption' });
      return;
    }
    this.setState({ sender_errorText: '' });
    this.setState({ receiver_errorText: '' });
    this.setState({ errorText: '' }, () => {
      // Encrypt data
      let encrypted_plaintext_chars = RSAUtils.encrypt(
        this.state.modeOfEncryption,
        this.state.split_data,
        this.state.sender_public_key,
        this.state.sender_private_key,
        this.state.receiver_public_key,
        this.state.receiver_private_key,
        this.state.sender_n,
        this.state.receiver_n
      );
      this.setState({
        encrypted_plaintext_chars: encrypted_plaintext_chars,
      });
    });
  }

  encrypt(e) {
    e.preventDefault();

    // Validate input
    this.handleValidation();
  }

  decrypt(e) {
    e.preventDefault();

    // Decrypt data
    let decrypted_plaintext_chars = RSAUtils.decrypt(
      this.state.modeOfEncryption,
      this.state.encrypted_plaintext_chars,
      this.state.sender_public_key,
      this.state.sender_private_key,
      this.state.receiver_public_key,
      this.state.receiver_private_key,
      this.state.sender_n,
      this.state.receiver_n
    );
    this.setState({
      decrypted_plaintext_chars: decrypted_plaintext_chars,
    });
  }

  render() {
    return (
      <div className="rsa-algor">
        <div className="body">
          <div className="container">
            <header>RSA Algorithm</header>

            <form action="#">
              <div className="form first">
                <div className="details personal">
                  <span className="title">Algorithm Attributes for Sender</span>
                  <div className="fields">
                    <div className="input-field">
                      <label>First Prime Number (p)</label>
                      <input
                        type="text"
                        placeholder="p"
                        value={this.state.sender_p}
                        onChange={(e) => {
                          this.handleChangeSenderP(e);
                        }}
                      />
                    </div>
                    <div className="input-field">
                      <label>Second Prime Number (q) </label>
                      <input
                        type="text"
                        placeholder="q"
                        value={this.state.sender_q}
                        onChange={(e) => {
                          this.handleChangeSenderQ(e);
                        }}
                      />
                    </div>
                    <div className="input-field">
                      <label>p * q (n) </label>
                      <input
                        readOnly={true}
                        type="text"
                        placeholder="n"
                        value={this.state.sender_n}
                        disabled={true}
                      />
                    </div>
                    <div className="input-field">
                      <label>Totient of n (Φ(n))</label>
                      <input
                        readOnly={true}
                        type="text"
                        placeholder="Φ(n)"
                        value={this.state.sender_totient_of_n}
                        disabled={true}
                      />
                    </div>
                    <div className="input-field">
                      <label>Public Key (e) </label>
                      <input
                        type="text"
                        placeholder="e"
                        value={this.state.sender_public_key}
                        onChange={(e) => {
                          this.handleChangeSenderE(e);
                        }}
                      />
                    </div>
                    <div className="input-field">
                      <label>Private Key (d) </label>
                      <input
                        type="text"
                        placeholder="d"
                        value={this.state.sender_private_key}
                        onChange={(e) => {
                          this.handleChangeSenderD(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {this.state.sender_errorText && (
                <p className="errorText">{this.state.sender_errorText}</p>
              )}

              <div className="form first">
                <div className="details personal">
                  <span className="title">
                    Algorithm Attributes for Receiver
                  </span>
                  <div className="fields">
                    <div className="input-field">
                      <label>First Prime Number (p)</label>
                      <input
                        type="text"
                        placeholder="p"
                        value={this.state.receiver_p}
                        onChange={(e) => {
                          this.handleChangeReceiverP(e);
                        }}
                      />
                    </div>
                    <div className="input-field">
                      <label>Second Prime Number (q) </label>
                      <input
                        type="text"
                        placeholder="q"
                        value={this.state.receiver_q}
                        onChange={(e) => {
                          this.handleChangeReceiverQ(e);
                        }}
                      />
                    </div>
                    <div className="input-field">
                      <label>p * q (n) </label>
                      <input
                        readOnly={true}
                        type="text"
                        placeholder="n"
                        value={this.state.receiver_n}
                        disabled={true}
                      />
                    </div>
                    <div className="input-field">
                      <label>Totient of n (Φ(n))</label>
                      <input
                        readOnly={true}
                        type="text"
                        placeholder="Φ(n)"
                        value={this.state.receiver_totient_of_n}
                        disabled={true}
                      />
                    </div>
                    <div className="input-field">
                      <label>Public Key (e) </label>
                      <input
                        type="text"
                        placeholder="e"
                        value={this.state.receiver_public_key}
                        onChange={(e) => {
                          this.handleChangeReceiverE(e);
                        }}
                      />
                    </div>
                    <div className="input-field">
                      <label>Private Key (d) </label>
                      <input
                        type="text"
                        placeholder="d"
                        value={this.state.receiver_private_key}
                        onChange={(e) => {
                          this.handleChangeReceiverD(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {this.state.receiver_errorText && (
                <p className="errorText">{this.state.receiver_errorText}</p>
              )}

              <div className="form first">
                <div className="details personal">
                  <span className="title">Data Encryption Attributes</span>
                  <div className="fields">
                    <div className="input-field">
                      <label>Data to Encrypt</label>
                      <input
                        type="text"
                        placeholder="data to encrypt"
                        onChange={(e) => {
                          this.handleChangeDataToEncrypt(e);
                        }}
                      />
                    </div>
                    <div className="input-field">
                      <label>Data Type for Encryption</label>
                      <select
                        className="custom-select"
                        onChange={(e) => {
                          this.handleChangeDataTypeForEncr(e);
                        }}
                      >
                        <option value="text">Text</option>
                        <option value="characters">Plaintext Characters</option>
                      </select>
                    </div>
                    <div className="input-field">
                      <label>Mode of Encryption/Decryption</label>
                      <select
                        className="custom-select"
                        onChange={(e) => {
                          this.handleChangeModeOfEncr(e);
                        }}
                      >
                        <option value="ci">Confidentiality & Integrity</option>
                        <option value="confidentiality">Confidentiality</option>
                        <option value="integrity">Integrity</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {this.state.errorText && (
                <p className="errorText">{this.state.errorText}</p>
              )}

              <div className="button-grp">
                <button
                  onClick={(e) => {
                    this.encrypt(e);
                  }}
                  className="generate btn-mv"
                >
                  <span className="btnText">Encrypt</span>
                </button>
              </div>

              {this.state.encrypted_plaintext_chars.length > 0 && (
                <div>
                  <p className="encryption_str">
                    {this.state.dataTypeForEncryption === 'text' ? (
                      <span>
                        The plaintext characters of the input{' '}
                        <strong>{this.state.dataToEncrypt}</strong> is{' '}
                        <strong>{this.state.split_data.join(' ')}</strong>.
                      </span>
                    ) : (
                      <span>
                        The text of the input{' '}
                        <strong>{this.state.dataToEncrypt}</strong> is{' '}
                        <strong>
                          {RSAUtils.plaintext_chars_to_string(
                            this.state.split_data
                          )}
                        </strong>
                        .
                      </span>
                    )}
                  </p>
                  <p className="encryption_str_b">
                    The plaintext characters of the encrypted input is{' '}
                    <strong>
                      {this.state.encrypted_plaintext_chars.join(' ')}
                    </strong>
                    .
                  </p>
                  {this.state.modeOfEncryption === 'ci' && (
                    <ul>
                      {this.state.encrypted_plaintext_chars.map(
                        (enc_char, idx) => {
                          return (
                            <li className="li" key={idx}>
                              ({this.state.split_data[idx]}
                              <sup>
                                {this.state.sender_private_key}
                              </sup> mod {this.state.sender_n})
                              <sup>{this.state.receiver_public_key}</sup> mod{' '}
                              {this.state.receiver_n} ={' '}
                              <strong>{enc_char}</strong>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}

                  {this.state.modeOfEncryption === 'confidentiality' && (
                    <ul>
                      {this.state.encrypted_plaintext_chars.map(
                        (enc_char, idx) => {
                          return (
                            <li className="li" key={idx}>
                              {this.state.split_data[idx]}
                              <sup>
                                {this.state.receiver_public_key}
                              </sup> mod {this.state.receiver_n} ={' '}
                              <strong>{enc_char}</strong>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}

                  {this.state.modeOfEncryption === 'integrity' && (
                    <ul>
                      {this.state.encrypted_plaintext_chars.map(
                        (enc_char, idx) => {
                          return (
                            <li className="li" key={idx}>
                              {this.state.split_data[idx]}
                              <sup>
                                {this.state.sender_private_key}
                              </sup> mod {this.state.sender_n} ={' '}
                              <strong>{enc_char}</strong>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}

                  <div className="button-grp">
                    <button
                      onClick={(e) => {
                        this.decrypt(e);
                      }}
                      className="generate btn-mv"
                    >
                      <span className="btnText">Decrypt</span>
                    </button>
                  </div>
                </div>
              )}

              {this.state.decrypted_plaintext_chars.length > 0 && (
                <div>
                  <p className="encryption_str">
                    The decrypted plaintext characters are{' '}
                    <strong>
                      {this.state.decrypted_plaintext_chars.join(' ')}
                    </strong>{' '}
                    which translate to{' '}
                    <strong>
                      {RSAUtils.plaintext_chars_to_string(
                        this.state.decrypted_plaintext_chars
                      )}
                    </strong>
                    .
                  </p>

                  {this.state.modeOfEncryption === 'ci' && (
                    <ul>
                      {this.state.decrypted_plaintext_chars.map(
                        (enc_char, idx) => {
                          return (
                            <li className="li" key={idx}>
                              ({this.state.split_data[idx]}
                              <sup>
                                {this.state.sender_private_key}
                              </sup> mod {this.state.sender_n})
                              <sup>{this.state.receiver_public_key}</sup> mod{' '}
                              {this.state.receiver_n} ={' '}
                              <strong>{enc_char}</strong>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}

                  {this.state.modeOfEncryption === 'confidentiality' && (
                    <ul>
                      {this.state.decrypted_plaintext_chars.map(
                        (enc_char, idx) => {
                          return (
                            <li className="li" key={idx}>
                              {this.state.encrypted_plaintext_chars[idx]}
                              <sup>
                                {this.state.receiver_private_key}
                              </sup> mod {this.state.receiver_n} ={' '}
                              <strong>{enc_char}</strong>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}

                  {this.state.modeOfEncryption === 'integrity' && (
                    <ul>
                      {this.state.decrypted_plaintext_chars.map(
                        (enc_char, idx) => {
                          return (
                            <li className="li" key={idx}>
                              {this.state.encrypted_plaintext_chars[idx]}
                              <sup>{this.state.sender_public_key}</sup> mod{' '}
                              {this.state.sender_n} ={' '}
                              <strong>{enc_char}</strong>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default RSAMain;

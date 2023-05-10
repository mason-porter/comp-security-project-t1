import { Component } from 'react';
import * as VigenereUtils from './VigenereUtils';
import './Vigenere.css';

class VigenereMain extends Component {
  constructor() {
    super();

    this.plaintext = '';
    this.cipher_key = '';
    this.process_title = '';
    this.cipher_input = '';

    this.state = {
      plaintext: this.plaintext,
      cipher_key: this.cipher_key,
      process_title: this.process_title,
      cipher_input: this.cipher_input,
      errorText: '',
    };
  }

  handleChangePlaintext(e) {
    this.setState({ plaintext: e.target.value });
  }

  handleChangeCipherKey(e) {
    this.setState({ cipher_key: e.target.value });
  }

  handleChangeCipherinput(e) {
    this.setState({ cipher_input: e.target.value });
  }

generateKey(){
    this.state.process_title = this.state.cipher_key;
    this.state.process_title=this.state.process_title.split("");
    if(this.state.plaintext.length == this.state.process_title.length)
        return this.state.process_title.join("");
    else{
        let temp=this.state.process_title.length;   
        for (let i = 0;i<(this.state.plaintext.length-temp) ; i++){  
            this.state.process_title.push(this.state.process_title[i % ((this.state.process_title).length)])
        }
    }
    return this.state.process_title.join("");
}

cipherText(){
    let cipher_text="";
    for (let i = 0; i < this.state.plaintext.length; i++){
        // converting in range 0-25
        let x = (this.state.plaintext[i].charCodeAt(0) + this.state.process_title[i].charCodeAt(0)) % 26;
        // convert into alphabets(ASCII)
        x += 'A'.charCodeAt(0);
        cipher_text+=String.fromCharCode(x);
    }
    return cipher_text;
}

originalText(){
    let orig_text="";
    for (let i = 0 ; i < this.state.cipher_input.length; i++){
        let x = (this.state.cipher_input[i].charCodeAt(0) - this.state.process_title[i].charCodeAt(0) + 26) %26;
        x += 'A'.charCodeAt(0);
        orig_text+=String.fromCharCode(x);
    }
    return orig_text;
}

  validate_input_2() {
    // Ensure that plaintext and ciphertext are provided.
    if (this.state.cipher_key.length < 1 || this.state.cipher_input < 1) {
      this.setState({
        errorText:
          'Ciphertext and Cipher Key must be provided.',
      });
      return;
    }

    const ciphertext_hex = VigenereUtils.text_to_hex_array(this.state.cipher_input);
    if (ciphertext_hex.length > 16) {
      this.setState({
        errorText:
          'Ciphertext is too long. Cannot be longer than 16 hex chars',
      });
      return;
    }

    if (this.state.cipher_input.split(' ').length > 16) {
      this.setState({
        errorText:
          'Ciphertext is too long. Cannot be longer than 16 hex chars',
      });
      return;
    }

    const cipher_key_hex = VigenereUtils.text_to_hex_array(this.state.cipher_key);
    if (cipher_key_hex.length > 16) {
      this.setState({
        errorText:
          'Cipher key is too long. Cannot be longer than 16 hex chars',
      });
      return;
    }
  
    if (this.state.cipher_key.split(' ').length > 16) {
      this.setState({
        errorText:
          'Cipher key is too long. Cannot be longer than 16 hex chars',
      });
      return;
    }
    this.generateKey();
    this.state.process_title = this.originalText();
    this.setState({
      displayertitle:
        `Decryption: ${this.state.process_title}`,
    });
    return;
  }

  validate_input() {
    // Ensure that plaintext and ciphertext are provided.
    if (this.state.cipher_key.length < 1 || this.state.plaintext < 1) {
      this.setState({
        errorText:
          'Plaintext and Cipher Key must be provided.',
      });
      return;
    }

    const plaintext_hex = VigenereUtils.text_to_hex_array(this.state.plaintext);
    if (plaintext_hex.length > 16) {
      this.setState({
        errorText:
          'Plaintext is too long. Cannot be longer than 16 hex chars',
      });
      return;
    }

    if (this.state.plaintext.split(' ').length > 16) {
      this.setState({
        errorText:
          'Plaintext is too long. Cannot be longer than 16 hex chars',
      });
      return;
    }

    const cipher_key_hex = VigenereUtils.text_to_hex_array(this.state.cipher_key);
    if (cipher_key_hex.length > 16) {
      this.setState({
        errorText:
          'Cipher key is too long. Cannot be longer than 16 hex chars',
      });
      return;
    }
  
    if (this.state.cipher_key.split(' ').length > 16) {
      this.setState({
        errorText:
          'Cipher key is too long. Cannot be longer than 16 hex chars',
      });
      return;
    }
    this.generateKey();
    this.state.process_title = this.cipherText();
    this.setState({
      displayertitle:
        `Encryption: ${this.state.process_title}`,
    });
    //return;
  }

  encrypt(e) {
    e.preventDefault();

    this.validate_input();
  }

  decrypt(e) {
    e.preventDefault();

    this.validate_input_2();
  }

  render() {
    return (
      <div className="aes-algor">
        <div className="body">
          <div className="container">
            <header>AES Algorithm</header>

            <form action="#">
              <div className="form first">
                <div className="details personal">
                  <div className="fields">
                    <div className="input-field">
                      <label>Plaintext</label>
                      <input
                        type="text"
                        placeholder="plaintext"
                        value={this.state.plaintext}
                        onChange={(e) => {
                          this.handleChangePlaintext(e);
                        }}
                      />
                    </div>
                    <div className="input-field">
                      <label>Ciphertext</label>
                      <input
                        type="text"
                        placeholder="ciphertext"
                        value={this.state.cipher_input}
                        onChange={(e) => {
                          this.handleChangeCipherinput(e);
                        }}
                      />
                    </div>
                    <div className="input-field"></div>
                    <div className="input-field">
                      <label>Cipher Key</label>
                      <input
                        type="text"
                        placeholder="cipher key"
                        value={this.state.cipher_key}
                        onChange={(e) => {
                          this.handleChangeCipherKey(e);
                        }}
                      />
                    </div>
                    <div className="input-field"></div>
                  </div>
                </div>

                <div className="button-grp">
                  <button className="generate btn-mv">
                    <span
                      className="btnText"
                      onClick={(e) => {
                        this.decrypt(e);
                      }}
                    >
                      Decrypt
                    </span>
                  </button>
                  <button className="generate btn-mv">
                    <span
                      className="btnText"
                      onClick={(e) => {
                        this.encrypt(e);
                      }}
                    >
                      Encrypt
                    </span>
                  </button>
                </div>

                {this.state.errorText && (
                  <p className="errorText">{this.state.errorText}</p>
                )}
              </div>

              {this.state.process_title && (
                <p className="displayertitle">{this.state.displayertitle}</p>
              )}

            </form>
          </div>
        </div>
      </div>
    );
  }

  
}

export default VigenereMain;
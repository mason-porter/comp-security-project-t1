import { Component } from 'react';
import * as AESUtils from './AESUtils';
import './AES.css';

class AESMain extends Component {
  constructor() {
    super();

    this.plaintext = '';
    this.plaintext_data_type = 'text';
    this.cipher_key = '';
    this.cipher_key_data_type = 'text';

    this.state = {
      plaintext: this.plaintext,
      plaintext_data_type: this.plaintext_data_type,
      cipher_key: this.cipher_key,
      cipher_key_data_type: this.cipher_key_data_type,
      errorText: '',
      plaintext_matrix: [],
      cipher_key_matrix: [],
      key_schedule: [],
      initial_round: [],
      main_rounds: [],
      final_round: [],
      process_title: [],
      current_displaying_matrices: [],
      display_footer: '',
    };
  }

  handleChangePlaintext(e) {
    this.setState({ plaintext: e.target.value });
  }

  handleChangePlaintextDataType(e) {
    this.setState({ plaintext_data_type: e.target.value });
  }

  handleChangeCipherKey(e) {
    this.setState({ cipher_key: e.target.value });
  }

  handleChangeCipherKeyDataType(e) {
    this.setState({ cipher_key_data_type: e.target.value });
  }

  randomize(e) {
    e.preventDefault();

    const random_plain_text = AESUtils.random_hex_array(16).join(' ');
    const random_cipher_key = AESUtils.random_hex_array(16).join(' ');
    this.setState({
      plaintext: random_plain_text,
      cipher_key: random_cipher_key,
      plaintext_data_type: 'hexadecimal',
      cipher_key_data_type: 'hexadecimal',
    });
  }

  validate_input() {
    // Ensure that plaintext and ciphertext are provided.
    if (this.state.cipher_key.length < 1 || this.state.plaintext < 1) {
      this.setState({
        errorText:
          'Plaintext and cipher key must be provided. You can click randomize to create random values',
      });
      return;
    }

    let plaintext_matrix,
      cipher_key_matrix = [];

    if (this.state.plaintext_data_type === 'text') {
      const plaintext_hex = AESUtils.text_to_hex_array(this.state.plaintext);
      if (plaintext_hex.length > 16) {
        this.setState({
          errorText:
            'Plaintext is too long. Cannot be longer than 16 hex chars',
        });
        return;
      }
      const plaintext_hex_padded = AESUtils.pad_arr(plaintext_hex, 16, '5a');
      plaintext_matrix = AESUtils.array_to_matrix(plaintext_hex_padded);
    } else {
      if (!AESUtils.is_hex_arr_valid(this.state.plaintext.split(' '))) {
        this.setState({
          errorText:
            'Plaintext is not valid. Can only contain hex values separated by a space',
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
      const plaintext_hex_padded = AESUtils.pad_arr(
        this.state.plaintext.split(' '),
        16,
        '5a'
      );
      plaintext_matrix = AESUtils.array_to_matrix(plaintext_hex_padded);
    }

    if (this.state.cipher_key_data_type === 'text') {
      const cipher_key_hex = AESUtils.text_to_hex_array(this.state.cipher_key);
      if (cipher_key_hex.length > 16) {
        this.setState({
          errorText:
            'Cipher key is too long. Cannot be longer than 16 hex chars',
        });
        return;
      }
      const cipher_key_hex_padded = AESUtils.pad_arr(cipher_key_hex, 16, '5a');
      cipher_key_matrix = AESUtils.array_to_matrix(cipher_key_hex_padded);
    } else {
      if (!AESUtils.is_hex_arr_valid(this.state.cipher_key.split(' '))) {
        this.setState({
          errorText:
            'Cipher key is not valid. Can only contain hex values separated by a space',
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
      const cipher_key_hex_padded = AESUtils.pad_arr(
        this.state.cipher_key.split(' '),
        16,
        '5a'
      );
      cipher_key_matrix = AESUtils.array_to_matrix(cipher_key_hex_padded);
    }

    this.setState(
      {
        plaintext_matrix: plaintext_matrix,
        cipher_key_matrix: cipher_key_matrix,
        errorText: '',
      },
      () => {
        this.create_key_schedule();
      }
    );
  }

  displayKeyScheduleGeneration() {
    // Display cipher key.
    this.setState({
      process_title: 'Key Schedule Generation',
      current_displaying_matrices: [this.state.cipher_key_matrix],
      display_footer: 'Cipher Key Matrix',
    });

    let that = this;
    let timeToDisplay = 4000;

    // Display the key schedule.
    setTimeout(function () {
      let all_round_keys = [];
      for (let i = 1; i <= 11; i++) {
        all_round_keys.push(AESUtils.get_round_key(that.state.key_schedule, i));
      }

      that.setState({
        process_title: 'Key Schedule Generation',
        current_displaying_matrices: all_round_keys,
        display_footer: 'Round Key',
      });
    }, timeToDisplay);

    // Display the initial round.
    setTimeout(function () {
      that.setState({
        process_title: 'Initial Round',
        current_displaying_matrices: [
          that.state.plaintext_matrix,
          that.state.cipher_key_matrix,
          ...that.state.initial_round,
        ],
        display_footer: 'Initial Round',
      });
    }, timeToDisplay * 2);

    // Display the main rounds.
    for (let i = 1; i <= 9; i++) {
      setTimeout(function () {
        that.setState({
          process_title: 'Main Round ' + i,
          current_displaying_matrices: that.state.main_rounds[i - 1],
          display_footer: 'Main Round',
        });
      }, timeToDisplay * 2 + timeToDisplay * i);
    }

    // Display the final round.
    setTimeout(function () {
      that.setState({
        process_title: 'Final Round',
        current_displaying_matrices: that.state.final_round,
        display_footer: 'Final Round',
      });
    }, timeToDisplay * 2 + timeToDisplay * 10);
  }

  run_final_round() {
    const last_main_round =
      this.state.main_rounds[this.state.main_rounds.length - 1];
    const last_rk = last_main_round[last_main_round.length - 1];

    const sub_bytes = AESUtils.sub_bytes(last_rk);
    const shift_rows = AESUtils.shift_rows(sub_bytes);
    const round_key = AESUtils.get_round_key(this.state.key_schedule, 11);
    const add_rk = AESUtils.add_round_key(shift_rows, round_key);

    const final_round = [sub_bytes, shift_rows, add_rk];
    this.setState({ final_round: final_round }, () => {
      console.log('key schedule', this.state.key_schedule);
      console.log('initial_round: ', this.state.initial_round);
      console.log('main_rounds: ', this.state.main_rounds);
      console.log('final_round: ', this.state.final_round);

      // Begin display.
      this.displayKeyScheduleGeneration();
    });
  }

  run_main_rounds() {
    let main_rounds = [];

    let num_rounds = 1;
    let init_rk = this.state.initial_round[0];
    while (num_rounds <= 9) {
      let sub_bytes = AESUtils.sub_bytes(init_rk);
      let shift_rows = AESUtils.shift_rows(sub_bytes);
      let mix_cols = AESUtils.mix_columns(shift_rows);
      let round_key = AESUtils.get_round_key(
        this.state.key_schedule,
        num_rounds + 1
      );
      let add_r_k = AESUtils.add_round_key(mix_cols, round_key);

      init_rk = add_r_k;
      main_rounds.push([sub_bytes, shift_rows, mix_cols, add_r_k]);
      num_rounds += 1;
    }

    this.setState({ main_rounds: main_rounds }, () => {
      this.run_final_round();
    });
  }

  run_initial_round() {
    const cipher_key = AESUtils.get_round_key(this.state.key_schedule, 1);
    const add_r_k = AESUtils.add_round_key(
      this.state.plaintext_matrix,
      cipher_key
    );
    this.setState(
      {
        initial_round: [add_r_k],
      },
      () => {
        this.run_main_rounds();
      }
    );
  }

  create_key_schedule() {
    const key_schedule = AESUtils.create_key_schedule(
      this.state.cipher_key_matrix
    );
    this.setState(
      {
        key_schedule: key_schedule,
      },
      () => {
        this.run_initial_round();
      }
    );
  }

  encrypt(e) {
    e.preventDefault();

    this.validate_input();
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
                      <label>Plaintext Data Type</label>
                      <select
                        className="custom-select"
                        value={this.state.plaintext_data_type}
                        onChange={(e) => {
                          this.handleChangePlaintextDataType(e);
                        }}
                      >
                        <option value="text">Text</option>
                        <option value="hexadecimal">Hexadecimal</option>
                      </select>
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
                    <div className="input-field">
                      <label>Cipher Key Data Type</label>
                      <select
                        className="custom-select"
                        value={this.state.cipher_key_data_type}
                        onChange={(e) => {
                          this.handleChangeCipherKeyDataType(e);
                        }}
                      >
                        <option value="text">Text</option>
                        <option value="hexadecimal">Hexadecimal</option>
                      </select>
                    </div>
                    <div className="input-field"></div>
                  </div>
                </div>

                <div className="button-grp">
                  <button className="generate btn-mv">
                    <span
                      className="btnText"
                      onClick={(e) => {
                        this.randomize(e);
                      }}
                    >
                      Randomize
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
                <p className="displayertitle">{this.state.process_title}</p>
              )}

              {this.state.current_displaying_matrices && (
                <div className="displayer fields">
                  {this.state.current_displaying_matrices.map((matrix, idx) => {
                    return (
                      <div key={idx} className="display-container">
                        <table className="matrix">
                          <tbody>
                            <tr>
                              <td>{matrix[0][0]}</td>
                              <td>{matrix[0][1]}</td>
                              <td>{matrix[0][2]}</td>
                              <td>{matrix[0][3]}</td>
                            </tr>
                            <tr>
                              <td>{matrix[1][0]}</td>
                              <td>{matrix[1][1]}</td>
                              <td>{matrix[1][2]}</td>
                              <td>{matrix[1][3]}</td>
                            </tr>
                            <tr>
                              <td>{matrix[2][0]}</td>
                              <td>{matrix[2][1]}</td>
                              <td>{matrix[2][2]}</td>
                              <td>{matrix[2][3]}</td>
                            </tr>
                            <tr>
                              <td>{matrix[3][0]}</td>
                              <td>{matrix[3][1]}</td>
                              <td>{matrix[3][2]}</td>
                              <td>{matrix[3][3]}</td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="matrix-label">
                          {this.state.display_footer === 'Cipher Key Matrix'
                            ? 'Cipher Key Matrix'
                            : ''}

                          {this.state.display_footer === 'Round Key'
                            ? 'Round Key ' + parseInt(idx + 1)
                            : ''}

                          {this.state.display_footer === 'Initial Round' &&
                          idx === 0
                            ? 'Plaintext Matrix'
                            : ''}
                          {this.state.display_footer === 'Initial Round' &&
                          idx === 1
                            ? 'Cipher Key Matrix'
                            : ''}
                          {this.state.display_footer === 'Initial Round' &&
                          idx === 2
                            ? 'Add Round Key'
                            : ''}

                          {this.state.display_footer === 'Main Round' &&
                          idx === 0
                            ? 'SubBytes'
                            : ''}
                          {this.state.display_footer === 'Main Round' &&
                          idx === 1
                            ? 'ShiftRows'
                            : ''}
                          {this.state.display_footer === 'Main Round' &&
                          idx === 2
                            ? 'MixColumns'
                            : ''}
                          {this.state.display_footer === 'Main Round' &&
                          idx === 3
                            ? 'AddRoundKey'
                            : ''}

                          {this.state.display_footer === 'Final Round' &&
                          idx === 0
                            ? 'SubBytes'
                            : ''}
                          {this.state.display_footer === 'Final Round' &&
                          idx === 1
                            ? 'ShiftRows'
                            : ''}
                          {this.state.display_footer === 'Final Round' &&
                          idx === 2
                            ? 'AddRoundKey = Final'
                            : ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default AESMain;
import React from 'react';

class AlarmAlert extends React.Component {
  render() {
    const { onStop } = this.props;

    return (
      <section className="alarm-alert" role="alert">
        <p>O alarme está despertando!</p>
        <img src="/Alarme.gif" alt="Relógio despertador tocando" />
        <button type="button" onClick={onStop}>Parar alarme</button>
      </section>
    );
  }
}

export default AlarmAlert;
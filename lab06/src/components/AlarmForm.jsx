import React from 'react';

class AlarmForm extends React.Component {
  render() {
    const { hour, minute, message, onChange, onSubmit } = this.props;

    return (
      <form className="alarm-form" onSubmit={onSubmit}>
        <label htmlFor="hour">Hora</label>
        <input
          id="hour"
          name="hour"
          type="number"
          min="0"
          max="23"
          placeholder="0 a 23"
          value={hour}
          onChange={onChange}
          required
        />

        <label htmlFor="minute">Minuto</label>
        <input
          id="minute"
          name="minute"
          type="number"
          min="0"
          max="59"
          placeholder="0 a 59"
          value={minute}
          onChange={onChange}
          required
        />

        <button type="submit">Registrar alarme</button>
        {message && <p className="message" role="status">{message}</p>}
      </form>
    );
  }
}

export default AlarmForm;

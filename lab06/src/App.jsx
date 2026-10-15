import React from 'react';
import AlarmAlert from './components/AlarmAlert.jsx';
import AlarmForm from './components/AlarmForm.jsx';
import CurrentDateTime from './components/CurrentDateTime.jsx';
import Alarm from './models/Alarm.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hour: '',
      minute: '',
      currentDate: new Date(),
      alarm: null,
      isRinging: false,
      message: '',
    };

    this.timer = null;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.registerAlarm = this.registerAlarm.bind(this);
    this.stopAlarm = this.stopAlarm.bind(this);
    this.updateClock = this.updateClock.bind(this);
  }

  componentDidMount() {
    this.timer = window.setInterval(this.updateClock, 1000);
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value, message: '' });
  }

  registerAlarm(event) {
    event.preventDefault();

    const { hour, minute } = this.state;
    const numericHour = Number(hour);
    const numericMinute = Number(minute);
    const isValid = hour !== ''
      && minute !== ''
      && Number.isInteger(numericHour)
      && Number.isInteger(numericMinute)
      && numericHour >= 0
      && numericHour <= 23
      && numericMinute >= 0
      && numericMinute <= 59;

    if (!isValid) {
      this.setState({ message: 'Informe uma hora entre 0 e 23 e um minuto entre 0 e 59.' });
      return;
    }

    const alarm = new Alarm(numericHour, numericMinute);
    this.setState({
      alarm,
      isRinging: alarm.matches(new Date()),
      message: `Alarme registrado para ${alarm.format()}.`,
    });
  }

  updateClock() {
    const currentDate = new Date();

    this.setState((state) => ({
      currentDate,
      isRinging: state.isRinging || Boolean(state.alarm?.matches(currentDate)),
    }));
  }

  stopAlarm() {
    this.setState({
      alarm: null,
      isRinging: false,
      message: 'Alarme encerrado.',
    });
  }

  render() {
    const { hour, minute, currentDate, isRinging, message } = this.state;

    return (
      <main className="app">
        <h1>Despertador</h1>
        <AlarmForm
          hour={hour}
          minute={minute}
          message={message}
          onChange={this.handleInputChange}
          onSubmit={this.registerAlarm}
        />
        <CurrentDateTime date={currentDate} />
        {isRinging && <AlarmAlert onStop={this.stopAlarm} />}
      </main>
    );
  }
}

export default App;

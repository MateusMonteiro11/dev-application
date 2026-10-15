class Alarm {
  constructor(hour, minute) {
    this.hour = Number(hour);
    this.minute = Number(minute);
  }

  matches(date) {
    return date.getHours() === this.hour && date.getMinutes() === this.minute;
  }

  format() {
    return `${String(this.hour).padStart(2, '0')}:${String(this.minute).padStart(2, '0')}`;
  }
}

export default Alarm;

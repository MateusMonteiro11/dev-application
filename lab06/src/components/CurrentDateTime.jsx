import React from 'react';

class CurrentDateTime extends React.Component {
  render() {
    const { date } = this.props;

    return (
      <section className="current-date-time" aria-live="polite">
        <p>Horário atual: {date.toLocaleTimeString('pt-BR')}</p>
        <p>Data atual: {date.toLocaleDateString('pt-BR')}</p>
      </section>
    );
  }
}

export default CurrentDateTime;

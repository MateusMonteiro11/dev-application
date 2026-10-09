import reactLogo from '../imagens/react.webp'
import javaScriptLogo from '../imagens/JavaScript.png'
import htmlLogo from '../imagens/html.png'
import cssLogo from '../imagens/css.png'
import book1 from '../imagens/book1.jpg'
import book2 from '../imagens/book2.jpg'
import book3 from '../imagens/book3.jpg'

const books = [
  { src: book1, alt: 'Capa do livro 1' },
  { src: book2, alt: 'Capa do livro 2' },
  { src: book3, alt: 'Capa do livro 3' },
]

const contacts = [
  { name: 'Prof. Vinicius Vono Peruzzi', email: 'vperuzzi@fei.edu.br' },
  { name: 'Apenas um aluno aí', email: 'contato@mateusmonteiro.dev' },
]

const resources = [
  { label: 'React', url: 'https://www.w3schools.com/REACT/DEFAULT.ASP/' },
  { label: 'HTML', url: 'https://www.w3schools.com/html/' },
  { label: 'CSS', url: 'https://www.w3schools.com/css/' },
  { label: 'JavaScript', url: 'https://www.w3schools.com/js/' },
]

export default function App() {
  return (
    <div className="page-shell">
      <header className="site-header">
        <img className="header-logo header-logo--cpp" src={reactLogo} alt="" aria-hidden="true" />
        <h1>Aprendendo React para desenvolvimento web</h1>
        <img className="header-logo header-logo--java" src={javaScriptLogo} alt="" aria-hidden="true" />
      </header>

      <nav className="site-nav" aria-label="Navegação principal">
        <a href="#inicio">Home</a>
        <a href="#livros">Livros</a>
        <a href="#videos">Vídeos</a>
        <a href="#contatos">Contatos</a>
      </nav>

      <main>
        <section className="intro content-section" id="inicio">
          <h2>Introdução</h2>
          <p>
            Com o React, você cria interfaces organizadas em componentes reutilizáveis, que controlam tanto a exibição quanto o
            comportamento da aplicação. Ele permite atualizar elementos de forma dinâmica, sem recarregar a página inteira, além de
            facilitar a aplicação de estilos, animações e recursos interativos de maneira escalável. (Fonte Usada: SansSerif, tamanho 20pt)
          </p>
          <p>
            O React é uma das bibliotecas mais populares do ecossistema JavaScript e tornou-se referência no desenvolvimento de
            interfaces modernas. Sua principal força está na criação de componentes reutilizáveis, que tornam o código mais organizado e
            facilitam a construção de aplicações escaláveis e de fácil manutenção. (Fonte Usada: SansSerif, tamanho 20pt)
          </p>
        </section>

        <section className="content-section" id="livros">
          <h2>Livros</h2>
          <div className="books-grid">
            {books.map((book) => (
              <figure className="book" key={book.alt}>
                <img src={book.src} alt={book.alt} />
              </figure>
            ))}
          </div>
        </section>

        <section className="content-section media-section" id="videos">
          <h2>Aprenda REACT na FEI</h2>
          <div className="media-grid">
            <iframe
              className="media-frame media-frame--video"
              src="https://www.youtube.com/embed/4MHAOPxcnsQ?si=5LCT6lIViK_f70eJ"
              title="Aula de programação FEI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <iframe
              className="media-frame media-frame--map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.648556785657!2d-46.581586585019195!3d-23.724241184602274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce4158ef9c7c05%3A0x776b798985695f52!2sCentro%20Universit%C3%A1rio%20FEI%20-%20Campus%20S%C3%A3o%20Bernardo%20do%20Campo!5e0!3m2!1spt-BR!2sbr!4v1630280666216!5m2!1spt-BR!2sbr"
              title="Localização do Centro Universitário FEI"
              loading="lazy"
            />
          </div>
        </section>

        <section className="content-section contacts-section" id="contatos">
          <h2>Contatos</h2>
          <div className="contact-table-wrap">
            <table className="contact-table">
              <thead><tr><th scope="col">Nome</th><th scope="col">E-mail</th></tr></thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.email}>
                    <td>{contact.name}</td>
                    <td><a href={`mailto:${contact.email}`}>{contact.email}</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="resources" aria-labelledby="resources-title">
          <h2 id="resources-title">Sites para consulta</h2>
          <ul>
            {resources.map((resource) => (
              <li key={resource.label}>
                <strong>{resource.label}:</strong>{' '}
                <a href={resource.url} target="_blank" rel="noreferrer">{resource.url}</a>
              </li>
            ))}
          </ul>
        </aside>
      </main>

      <footer className="site-footer">
        <img src={htmlLogo} alt="HTML5" />
        <p>
          Desejamos um excelente semestre a todos.
          <small>Fonte utilizada: Comic Sans MS, tamanho responsivo.</small>
        </p>
        <img src={cssLogo} alt="CSS3" />
      </footer>
    </div>
  )
}

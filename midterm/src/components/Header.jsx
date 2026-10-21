export default function Header({ view, onNavigate }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <button className="logo" onClick={() => onNavigate('list')}>
          AI Era Jobs
        </button>
        <nav>
          <button
            className={view === 'list' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => onNavigate('list')}
          >
            Vacancies
          </button>
          <button
            className={view === 'add' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => onNavigate('add')}
          >
            + Post a job
          </button>
        </nav>
      </div>
    </header>
  )
}

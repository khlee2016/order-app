import './Header.css'

function Header({ currentPage, onNavigate }) {
  return (
    <header className="header">
      <h1 className="brand">COZY</h1>
      <nav className="nav">
        <button
          type="button"
          className={`nav-tab ${currentPage === 'order' ? 'active' : ''}`}
          onClick={() => onNavigate('order')}
        >
          주문하기
        </button>
        <button
          type="button"
          className={`nav-tab ${currentPage === 'admin' ? 'active' : ''}`}
          onClick={() => onNavigate('admin')}
        >
          관리자
        </button>
      </nav>
    </header>
  )
}

export default Header

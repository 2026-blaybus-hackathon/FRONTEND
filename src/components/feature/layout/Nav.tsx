import openedBook from "../../../assets/opened-book.svg";

const Nav = ({ children, isOpen }: { children?: React.ReactNode; isOpen?: boolean }) => {
  return (
    <nav className={`layout-nav ${isOpen ? "layout-nav--open" : ""}`}>
      <div className="layout-nav__top">
        <div className="layout-nav__brand">
          <img src={openedBook} alt="Seolstudy" />
          <span className="layout-nav__brand-name heading-3">Seolstudy</span>
        </div>
      </div>

      {children}

    </nav>
  );
};

export default Nav;

import Nav from "./Nav";

const Layout = ({ children }: any) => {
  return (
    <div>
      <Nav />

      {children}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;

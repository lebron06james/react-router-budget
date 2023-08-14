// rrd imports
import { Form, NavLink } from "react-router-dom";

// library
import { TrashIcon } from "@heroicons/react/24/solid";

// assets
import logomark from "../assets/logomark.svg";
import signup from "../assets/signup.svg";

const Nav = ({ userName }) => {
  return (
    <nav>
      <NavLink to="/" aria-label="Sign Up">
        <img src={logomark} alt="" height={30} />
        <span>Home</span>
      </NavLink>
      {userName === "lebron" && (
        <NavLink to="/signup" aria-label="Sign Up">
          <img src={signup} alt="" height={30} />
          <span>Sign Up</span>
        </NavLink>
      )}
      {userName && (
        <Form
          method="post"
          action="logout"
          onSubmit={(event) => {
            if (!confirm("Continue to sign-out?")) {
              event.preventDefault();
            }
          }}
        >
          <button type="submit" className="btn btn--warning">
            <span>Sign-out</span>
            <TrashIcon width={20} />
          </button>
        </Form>
      )}
    </nav>
  );
};
export default Nav;

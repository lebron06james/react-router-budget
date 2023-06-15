// rrd imports
import { Link, useLoaderData, useNavigate, useRouteError } from "react-router-dom";

// library imports
import { toast } from "react-toastify";
import { HomeIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/solid";

// components
import Intro from "../components/Intro";
import AddEventForm from "../components/AddEventForm";
import EventItem from "../components/EventItem";

//  helper functions
import { createEvent, deleteItem, fetchData, waait } from "../helpers";
import SignupForm from "../components/SignupForm";

// loader
export function signupLoader() {
  const userName = fetchData("userName");
  const events = fetchData("events");
  return { userName, events };
}

// action
export async function signupAction({ request }) {
  await waait();

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  const email = values.email;
  const password = values.password;

  const postvalue = { email: email, password: password };

  // new user submission
  if (_action === "signUp") {
    try {

      const response = await fetch('http://localhost:4000/api/user/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(postvalue),
      });

      const json = await response.json();

      if (!response.ok) {
        return toast.error(
          `Oops, that didn't go right. Error message: ${json.error}`
        );
      }
      if (response.ok) {
        return toast.success(`Successfully created new account, ${email}`);
      }
    } catch (e) {
      throw new Error("There was a problem creating your account.");
    }
  }
}

const SignupPage = () => {
  const { userName, events } = useLoaderData();
  const navigate = useNavigate();

  return (
    <>
      {userName ? (
        userName === "react.router.budget@gmail.com" ? (
          <SignupForm />
        ) : (
          <div className="dashboard">
            <h1>
              Sorry, <span className="accent">{userName}</span>
            </h1>
            <div className="grid-sm">
              <p>You are not allowed to view this page. Please click Go Back button.</p>
              <div className="flex-md">
                <button className="btn btn--dark" onClick={() => navigate(-1)}>
                  <ArrowUturnLeftIcon width={20} />
                  <span>Go Back</span>
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        <Intro />
      )}
    </>
  );
};
export default SignupPage;

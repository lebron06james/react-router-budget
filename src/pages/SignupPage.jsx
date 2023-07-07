// rrd imports
import {
  Link,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "react-router-dom";

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

  // get api url env
  const apiUrl = await import.meta.env.VITE_API_URL;

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  const email = values.email;
  const password = values.password;
  const username = values.username;
  const usertype = values.newUserType;

  if (username === 'LeBron') {
    return toast.error(
      `Sorry, that is a reserved first name or nickname. You are not allowed to use it. Please use a different name.`
    );
  }

  const postvalue = {
    email: email,
    password: password,
    username: username,
    usertype: usertype,
  };

  // new user submission
  if (_action === "signUp") {
    try {
      const response = await fetch(`${apiUrl}/api/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      throw new Error("There was a problem signing-in to your account.");
    }
  }
}

const SignupPage = () => {
  const { userName, events } = useLoaderData();
  const navigate = useNavigate();

  return (
    <>
      {userName ? (
        userName === "LeBron" ? (
          <SignupForm />
        ) : (
          <div className="dashboard">
            <h1>
              Sorry, <span className="accent">{userName}</span>
            </h1>
            <div className="grid-sm">
              <p>
                You are not allowed to view this page. Please click Go Back
                button.
              </p>
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

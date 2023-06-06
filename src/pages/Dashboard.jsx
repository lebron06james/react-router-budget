// rrd imports
import { Link, useLoaderData } from "react-router-dom";

// library imports
import { toast } from "react-toastify";

// components
import Intro from "../components/Intro";
import AddEventForm from "../components/AddEventForm";
import EventItem from "../components/EventItem";

//  helper functions
import {
  createEvent,
  deleteItem,
  fetchData,
  waait,
} from "../helpers";

// loader
export function dashboardLoader() {
  const userName = fetchData("userName");
  const events = fetchData("events");
  return { userName, events };
}

// action
export async function dashboardAction({ request }) {
  await waait();

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // new user submission
  if (_action === "newUser") {
    try {
      localStorage.setItem("userName", JSON.stringify(values.userName));
      return toast.success(`Welcome, ${values.userName}`);
    } catch (e) {
      throw new Error("There was a problem creating your account.");
    }
  }

  if (_action === "createEvent") {
    try {
      createEvent({
        name: values.newEvent,
        pax: values.newEventPax,
        eventdate: values.newEventDate,
        eventtime: values.newEventTime,
        venue: values.newEventVenue,
        holdingroom: values.newEventHoldingRoom,
        updatedby: values.newUserName,
      });
      return toast.success("Event created!");
    } catch (e) {
      throw new Error("There was a problem creating your event.");
    }
  }

}

const Dashboard = () => {
  const { userName, events } = useLoaderData();

  return (
    <>
      {userName ? (
        <div className="dashboard">
          <h1>
            Welcome back, <span className="accent">{userName}</span>
          </h1>
          <div className="grid-sm">
            {events && events.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddEventForm userName={userName} />
                  {/* <AddExpenseForm budgets={budgets} /> */}
                </div>
                <h2>Existing Events</h2>
                <div className="budgets">
                  {events.map((event) => (
                    <EventItem key={event.id} event={event} />
                  ))}
                </div>

              </div>
            ) : (
              <div className="grid-sm">
                <p>Conveniently organize events' menu + recipes in one spot.</p>
                <p>Create an event to get started!</p>
                <AddEventForm userName={userName} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Intro />
      )}
    </>
  );
};
export default Dashboard;
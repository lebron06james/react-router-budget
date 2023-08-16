import { useState, useEffect } from "react";

// rrd imports
import { Link, useLoaderData, useNavigate, redirect } from "react-router-dom";

// library imports
import PocketBase from "pocketbase";
import { toast } from "react-toastify";

// components
import Intro from "../components/Intro";
import AddEventForm from "../components/AddEventForm";
import EventItem from "../components/EventItem";

//  helper functions
import { createEvent, deleteItem, fetchData, waait } from "../helpers";

const cvUTC = async (dateStr) => {
  // let MySQLDate = "2022-07-08 11:55:17";
  let MySQLDate = dateStr;
  // format the date string
  let date = MySQLDate.replace(/[-]/g, "/");
  // parse the proper date string from the formatted string.
  date = Date.parse(date);
  // create new date
  let jsDate = new Date(date);

  return jsDate;
};

// loader
export async function dashboardLoader() {
  // const userName = fetchData("userName");
  // const events = fetchData("events");

  // pb start

  // user
  const pb = new PocketBase(import.meta.env.VITE_PB_URI);

  const isValid = pb.authStore.isValid;

  const user = isValid
    ? await pb.collection("users").getOne(pb.authStore.model.id)
    : "";

  const userName = user.username;

  const usertype = user.usertype;

  const userprompt = "(" + usertype + ") " + userName;

  // events
  // const events = await pb.collection("events").getFullList({
  //   sort: "-created",
  // });

  const records = await pb.collection("events").getList(1, 50, {
    filter: 'created >= "2023-01-01 00:00:00"',
    sort: "-created",
  });

  const events = records.totalItems === 0 ? [] : records.items;

  // const events = fetchData("events");
  // pb end

  return { userName, events, isValid };
}

// action
export async function dashboardAction({ request }) {
  // await waait();

  // get api url env
  const apiUrl = await import.meta.env.VITE_API_URL;

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  const email = values.email;
  const password = values.password;

  const postvalue = { email: email, password: password };

  // new user submission
  if (_action === "newUser") {
    try {
      // old mongo
      // const response = await fetch(`${apiUrl}/api/user/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(postvalue),
      // });

      // const json = await response.json();

      // if (!response.ok) {
      //   return toast.error(
      //     `Oops, that didn't go right. Error message: ${json.error}`
      //   );
      // }
      // if (response.ok) {
      //   localStorage.setItem("user", JSON.stringify(json));
      //   localStorage.setItem("userName", JSON.stringify(json.username));

      //   return toast.success(`Welcome, ${json.username}`);

      // new pb
      const pb = new PocketBase(import.meta.env.VITE_PB_URI);

      const authData = await pb
        .collection("users")
        .authWithPassword(email, password);

      if (!pb.authStore.isValid) {
        return toast.error(
          `Oops, that didn't go right. Error message: ${authData.data.message}`
        );
      }
      if (pb.authStore.isValid) {
        return toast.success(`Welcome, ${authData.record.username}`);
      }
    } catch (e) {
      throw new Error("There was a problem creating your account.", e);
    }
  }

  if (_action === "createEvent") {
    // startdatetime: "2022-01-01 10:00:00.123Z",
    // enddatetime: "2022-01-01 10:00:00.123Z",

    // try {
    // createEvent({
    //   eventid: newEventId,
    //   name: values.newEvent,
    //   attire: values.newEventAttire,
    //   description: newEventDescription,
    //   pax: values.newEventPax,
    //   startdatetime: values.newEventStartDateTime,
    //   enddatetime: values.newEventEndDateTime,
    //   venue: values.newEventVenue,
    //   holdingroom: values.newEventHoldingRoom,
    //   dietaryrestrictions: values.newEventDietaryRestrictions,
    //   entrancegate: values.newEventEntranceGate,
    //   updatedby: values.newUserName,
    // });

    const pb = new PocketBase(import.meta.env.VITE_PB_URI);

    // use this in node express
    // const data = {
    //   eventid: 500,
    //   name: "Fortune 500 Event",
    //   attire: "Casual",
    //   description: "Billion Dollar Event",
    //   pax: "55",
    //   startdatetime: "2023-08-30 08:00",
    //   enddatetime: "2023-08-30 16:00",
    //   venue: "Million Dollar Venue",
    //   holdingroom: "North Korea",
    //   dietaryrestrictions: "Just cook them all",
    //   entrancegate: "Grand Entrance Gate",
    //   updatedby: "Bron",
    // };
    // data.startdatetime = await cvUTC(data.startdatetime);
    // data.enddatetime = await cvUTC(data.enddatetime);

    const eventdata = {
      eventid: values.newEventId,
      name: values.newEvent,
      attire: values.newEventAttire,
      description: values.newEventDescription,
      pax: values.newEventPax,
      startdatetime: values.newEventStartDateTime,
      enddatetime: values.newEventEndDateTime,
      venue: values.newEventVenue,
      holdingroom: values.newEventHoldingRoom,
      dietaryrestrictions: values.newEventDietaryRestrictions,
      entrancegate: values.newEventEntranceGate,
      updatedby: values.newUserName,
    };

    const utcStartDate = new Date(eventdata.startdatetime).toUTCString();
    const utcEndDate = new Date(eventdata.enddatetime).toUTCString();

    // eventdata.startdatetime = await cvUTC(eventdata.startdatetime);
    // eventdata.enddatetime = await cvUTC(eventdata.enddatetime);

    eventdata.startdatetime = utcStartDate;
    eventdata.enddatetime = utcEndDate;

    const record = await pb.collection("events").create(eventdata);

    return toast.success("Event created!");
    // } catch (e) {
    //   throw new Error("There was a problem creating your event.");
    // }
  }
}

const Dashboard = () => {
  const { userName, events, isValid } = useLoaderData();

  const navigate = useNavigate();

  const [ebents, setEbents] = useState(events || []);

  const pb = new PocketBase(import.meta.env.VITE_PB_URI);

  // Subscribe to changes in any events record
  pb.collection("events").subscribe("*", async function (e) {
    // console.log(e.action);
    // console.log(e.record);

    const obj = e.record;

    if (e.action === "create") {
      // if (obj.updatedby === "Bron") {
      try {
        // remove this save to db on actual
        // because it is already in the db
        // save to db...
        // createEvent({
        //   eventid: obj.eventid,
        //   name: obj.name,
        //   pax: Math.random(),
        //   startdatetime: obj.startdatetime,
        //   enddatetime: obj.enddatetime,
        //   venue: obj.location,
        //   holdingroom: obj.holdingroom,
        //   updatedby: obj.updatedby,
        // });

        // then update ebents state here
        setEbents((previousState) => [...previousState, obj]);
        // if (obj.updatedby === "Bron") {
        toast.success(`Event ${obj.name} has been added!`);
        // }
      } catch (e) {
        throw new Error("There was a problem creating your event.");
      }
      // }
    }
  });

  return (
    <>
      {isValid ? (
        <div className="dashboard">
          <h1>
            Welcome back, <span className="accent">{userName}</span>
          </h1>
          <div className="grid-sm">
            {ebents && ebents.length > 0 ? (
              <div className="grid-lg">
                <h2>Existing Events</h2>
                <div className="recipes">
                  {ebents.map((event) => (
                    <EventItem key={event.id} event={event} />
                  ))}
                </div>
                <div className="flex-lg">
                  <AddEventForm userName={userName} />
                  {/* <AddIngredientForm recipes={recipes} /> */}
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

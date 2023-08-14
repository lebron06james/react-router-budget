// rrd imports
import { Outlet, useLoaderData } from "react-router-dom";

// library imports
import PocketBase from "pocketbase";

// assets
import wave from "../assets/wave.svg";

// components
import Nav from "../components/Nav";

//  helper functions
import { fetchData } from "../helpers";

// loader
export async function mainLoader() {
  // const userName = fetchData("userName");

  const pb = new PocketBase(import.meta.env.VITE_PB_URI);

  const userName = pb.authStore.isValid
    ? await pb.collection("users").getOne(pb.authStore.model.id, {
        fields: "username",
      })
    : undefined;

  return { userName };
}

const Main = () => {
  const { userName } = useLoaderData();

  return (
    <div className="layout">
      <Nav userName={userName} />
      <main>
        <Outlet />
      </main>
      <img src={wave} alt="" />
    </div>
  );
};
export default Main;

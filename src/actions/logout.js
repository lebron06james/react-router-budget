// rrd imports
import { redirect } from "react-router-dom";

// library
import PocketBase from 'pocketbase';
import { toast } from "react-toastify";

// helpers
import { deleteItem } from "../helpers";

export async function logoutAction() {
  // // old
  // deleteItem({
  //   key: "user"
  // })
  // deleteItem({
  //   key: "userName"
  // })
  // deleteItem({
  //   key: "events"
  // })
  // deleteItem({
  //   key: "recipes"
  // })
  // deleteItem({
  //   key: "comments"
  // })
  // deleteItem({
  //   key: "ingredients"
  // })

  const pb = new PocketBase(import.meta.env.VITE_PB_URI);

  // Unsubscribe
  pb.collection('events').unsubscribe(); // remove all subscriptions in the collection

  // "logout" the last authenticated account
  pb.authStore.clear();

  toast.success("You've signed-out sucessfully!")
  // return redirect
  return redirect("/")
}
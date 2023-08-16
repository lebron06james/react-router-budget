// rrd import
import { redirect } from "react-router-dom";

// library
import PocketBase from 'pocketbase';
import { toast } from "react-toastify";

// helpers
import { deleteItem, getAllMatchingItems } from "../helpers";

export async function deleteEvent({ params }) {
  try {
    // deleteItem({
    //   key: "events",
    //   id: params.id,
    // });

    const pb = new PocketBase(import.meta.env.VITE_PB_URI);

    await pb.collection('events').delete(params.id);

    const associatedRecipes = getAllMatchingItems({
      category: "recipes",
      key: "eventId",
      value: params.id,
    });

    associatedRecipes.forEach((recipe) => {

      const associatedIngredients = getAllMatchingItems({
        category: "ingredients",
        key: "recipeId",
        value: recipe.id,
      });

      associatedIngredients.forEach((ingredient) => {
        deleteItem({
          key: "ingredients",
          id: ingredient.id,
        });
      });

      deleteItem({
        key: "recipes",
        id: recipe.id,
      });
    });

    const associatedComments = getAllMatchingItems({
      category: "comments",
      key: "eventId",
      value: params.id,
    });

    associatedComments.forEach((comment) => {

      deleteItem({
        key: "comments",
        id: comment.id,
      });

    });

    toast.success("Event deleted successfully!");
  } catch (e) {
    throw new Error("There was a problem deleting your event.");
  }
  return redirect("/");
}

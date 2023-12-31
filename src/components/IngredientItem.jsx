// rrd imports
import { Link, useFetcher } from "react-router-dom";

// library import
import { TrashIcon } from "@heroicons/react/24/solid";

// helper imports
import {
  formatCurrency,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helpers";

const IngredientItem = ({ ingredient, showRecipe }) => {
  const fetcher = useFetcher();

  const recipe = getAllMatchingItems({
    category: "recipes",
    key: "id",
    value: ingredient.recipeId,
  })[0];

  return (
    <>
      <td>{ingredient.name}</td>
      <td>{formatCurrency(ingredient.amount)}</td>
      <td>{formatDateToLocaleString(ingredient.createdAt)}</td>
      {showRecipe && (
        <td>
          <Link
            to={`/recipe/${recipe.id}`}
            style={{
              "--accent": recipe.color,
            }}
          >
            {recipe.name}
          </Link>
        </td>
      )}
      <td>
        <fetcher.Form method="post">
          <input type="hidden" name="_action" value="deleteIngredient" />
          <input type="hidden" name="ingredientId" value={ingredient.id} />
          <button
            type="submit"
            className="btn btn--warning"
            aria-label={`Delete ${ingredient.name} ingredient`}
          >
            <TrashIcon width={20} />
          </button>
        </fetcher.Form>
      </td>
    </>
  );
};
export default IngredientItem;
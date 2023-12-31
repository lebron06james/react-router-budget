export const waait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 800));

// utc to locale time
export const utcToLocaleTime = (utcDate) => {
  // 👇️ Example date and time in UTC
  // const utcDate = '2022-01-15T11:02:17Z';

  const date = new Date(utcDate);

  // 👇️ "Sat Jan 15 2022 13:02:17 GMT+0200 (Eastern European Standard Time)"
  // console.log(date);

  // ✅ Convert to Local time
  // console.log(date.toLocaleString()); // 👉️ "1/15/2022, 1:02:17 PM"
  const localeDate = date.toLocaleString();

  return localeDate;
};

// colors
const generateRandomColor = () => {
  const existingRecipeLength = fetchData("recipes")?.length ?? 0;
  return `${existingRecipeLength * 34} 65% 50%`;
};

// colors
const generateRandomEventColor = () => {
  const existingEventLength = fetchData("events")?.length ?? 0;
  return `${existingEventLength * 34} 65% 50%`;
};

// Local storage
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// Get all items from local storage
export const getAllMatchingItems = ({ category, key, value }) => {
  const data = fetchData(category) ?? [];
  return data.filter((item) => item[key] === value);
};

// delete item from local storage
export const deleteItem = ({ key, id }) => {
  const existingData = fetchData(key);
  if (id) {
    const newData = existingData.filter((item) => item.id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
};

// create event
export const createEvent = ({
  eventid,
  name,
  attire,
  description,
  startdatetime,
  enddatetime,
  venue,
  holdingroom,
  dietaryrestrictions,
  updatedby,
  entrancegate,
}) => {
  const newItem = {
    id: crypto.randomUUID(),
    eventid: eventid,
    name: name,
    attire: attire,
    description: description,
    pax: +pax,
    startdatetime: startdatetime,
    enddatetime: enddatetime,
    venue: venue,
    holdingroom: holdingroom,
    dietaryrestrictions: dietaryrestrictions,
    entrancegate: entrancegate,
    updatedby: updatedby,
    color: generateRandomEventColor(),
    createdAt: Date.now(),
  };
  const existingEvents = fetchData("events") ?? [];
  return localStorage.setItem(
    "events",
    JSON.stringify([...existingEvents, newItem])
  );
};

// create recipe
export const createRecipe = ({ name, amount, eventId }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    eventId: eventId,
    color: generateRandomColor(),
  };
  const existingRecipes = fetchData("recipes") ?? [];
  return localStorage.setItem(
    "recipes",
    JSON.stringify([...existingRecipes, newItem])
  );
};

// create ingredient
export const createIngredient = ({ name, amount, recipeId }) => {
  const newItem = {
    id: crypto.randomUUID(),
    name: name,
    createdAt: Date.now(),
    amount: +amount,
    recipeId: recipeId,
  };
  const existingIngredients = fetchData("ingredients") ?? [];
  return localStorage.setItem(
    "ingredients",
    JSON.stringify([...existingIngredients, newItem])
  );
};

// total spent by recipe
export const calculateSpentByRecipe = (recipeId) => {
  const ingredients = fetchData("ingredients") ?? [];
  const recipeSpent = ingredients.reduce((acc, ingredient) => {
    // check if ingredient.id === recipeId I passed in
    if (ingredient.recipeId !== recipeId) return acc;

    // add the current amount to my total
    return (acc += ingredient.amount);
  }, 0);
  return recipeSpent;
};

// FORMATTING
export const formatDateToLocaleString = (epoch) =>
  new Date(epoch).toLocaleDateString();

// Formating percentages
export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

// Format currency
export const formatCurrency = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "PHP",
  });
};

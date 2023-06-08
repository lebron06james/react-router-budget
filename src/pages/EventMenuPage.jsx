// rrd imports
import { Form, Link, useLoaderData } from "react-router-dom";

// library imports
import { toast } from "react-toastify";
import {
  BanknotesIcon,
  TrashIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";

// components
import Intro from "../components/Intro";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

//  helper functions
import {
  createBudget,
  createExpense,
  deleteItem,
  fetchData,
  waait,
  getAllMatchingItems,
} from "../helpers";

// loader
export async function eventMenuLoader({ params }) {
  const event = await getAllMatchingItems({
    category: "events",
    key: "id",
    value: params.id,
  })[0];

  const budgets = await getAllMatchingItems({
    category: "budgets",
    key: "eventId",
    value: event.id,
  });

  let expenses = [];

  budgets.forEach((budget) => {
    const _expenses = getAllMatchingItems({
      category: "expenses",
      key: "budgetId",
      value: budget.id,
    });

    expenses = [...expenses, ..._expenses];
  });

  const userName = fetchData("userName");
  // const budgets = fetchData("budgets");
  // const expenses = fetchData("expenses");

  return { event, userName, budgets, expenses };
}

// action
export async function eventMenuAction({ request }) {
  await waait();

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  // // new user submission
  // if (_action === "newUser") {
  //   try {
  //     localStorage.setItem("userName", JSON.stringify(values.userName));
  //     return toast.success(`Welcome, ${values.userName}`);
  //   } catch (e) {
  //     throw new Error("There was a problem creating your account.");
  //   }
  // }

  if (_action === "createBudget") {
    try {
      createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
        eventId: values.newBudgetEvent,
      });
      return toast.success("Budget created!");
    } catch (e) {
      throw new Error("There was a problem creating your budget.");
    }
  }

  if (_action === "createExpense") {
    try {
      createExpense({
        name: values.newExpense,
        amount: values.newExpenseAmount,
        budgetId: values.newExpenseBudget,
      });
      return toast.success(`Expense ${values.newExpense} created!`);
    } catch (e) {
      throw new Error("There was a problem creating your expense.");
    }
  }

  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });
      return toast.success("Expense deleted!");
    } catch (e) {
      throw new Error("There was a problem deleting your expense.");
    }
  }
}

const EventMenuPage = () => {
  const { event, userName, budgets, expenses } = useLoaderData();

  return (
    <>
      {userName ? (
        <div className="dashboard">
          <h1>
            Menu for,{" "}
            <span className="accent">
              {event.name}, {event.pax} Pax{" "}
            </span>
          </h1>
          <div className="grid-sm">
            <p>
              This event starts on <strong>{event.eventdate}</strong> at{" "}
              <strong>{event.eventtime}</strong>.
            </p>
            <p>
              Holding room is <strong>{event.holdingroom}</strong>.
            </p>
            <p>
              And the event will be held in <strong>{event.venue}</strong>.
            </p>
          </div>
          {/* delete button */}
          <div className="flex-sm">
            <Form
              method="post"
              action="delete"
              onSubmit={(ev) => {
                if (
                  !confirm(
                    "Are you sure you want to permanently delete this event?"
                  )
                ) {
                  ev.preventDefault();
                }
              }}
            >
              <button type="submit" className="btn btn--warning">
                <span>Delete this Event</span>
                <TrashIcon width={20} />
              </button>
            </Form>
          </div>
          {/* end delete button */}

          {/* comment button */}
          <div className="grid-sm">
            Recent comment: comment name here
            <Link to={`/comment/${event.id}`} className="btn">
              <span>Add Comment</span>
              <ChatBubbleOvalLeftEllipsisIcon width={20} />
            </Link>
          </div>

          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm event={event} />
                  <AddExpenseForm budgets={budgets} />
                </div>
                <h2>Existing Budgets</h2>
                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} />
                  ))}
                </div>
                {expenses && expenses.length > 0 && (
                  <div className="grid-md">
                    <h2>Recent Expenses</h2>
                    <Table
                      expenses={expenses
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 8)}
                    />
                    {expenses.length > 8 && (
                      <Link to="expenses" className="btn btn--dark">
                        View all expenses
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Your recipes, designed in one place.</p>
                <p>Create a Recipe to get started!</p>
                <AddBudgetForm event={event} />
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
export default EventMenuPage;

// rrd imports
import { Form, Link } from "react-router-dom";

// library imports
import { BanknotesIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

// helper functions
import {
//   calculateSpentByRecipe,
  formatCurrency,
  formatPercentage,
} from "../helpers";

const EventItem = ({ event }) => {
  const { id, eventid, name, pax, eventdate, eventtime, venue, holdingroom, updatedby, color } = event;
//   const spent = calculateSpentByRecipe(id);
  const spent = pax;

  return (
    <div
      className="recipe"
      style={{
        "--accent": color,
      }}
    >
      <div className="progress-text">
        <h3>{name}</h3>
        {/* <p>{formatCurrency(amount)} Pax</p> */}
        <p>{pax} Pax</p>
      </div>
      
      {/* <progress max={pax} value={spent}>
        {formatPercentage(spent / pax)}
      </progress> */}

      <progress max={pax} value={pax}>
        {formatPercentage(pax / pax)}
      </progress>

      {/* <div className="progress-text">
        <small>{formatCurrency(spent)} spent</small>
        <small>{formatCurrency(pax - spent)} remaining</small>
      </div> */}

      {/* <div className="progress-text">
        <small>Event Date: { eventdate }</small>
        <small>Updated by: { updatedby }</small>
      </div>

      <div className="progress-text">
        <small>Event Time: { eventtime }</small>
      </div> */}


      <div className="progress-text">
        <small>id: { eventid }</small>
        <small>Updated by: { updatedby }</small>
      </div>

      <div className="progress-text">
        <small></small>
      </div>

      <div className="progress-text">
        <small><strong>Start Date/Time: { eventdate }</strong></small>
        <small><b>Venue: { venue }</b></small>
      </div>

      <div className="progress-text">
        <small><strong>End Date/Time: { eventtime }</strong></small>
        <small><b>Holding Room: { holdingroom }</b></small>
      </div>

      <div className="flex-sm">
        Dietary restrictions: lorem ipsum ipsum lorem
        <Link to={`/event/${id}`} className="btn">
          <span>Create Menu</span>
          <BanknotesIcon width={20} />
        </Link>
        <Link to={`/comment/${id}`} className="btn">
          <span>Add Comment</span>
          <ChatBubbleOvalLeftEllipsisIcon width={20} />
        </Link>
      </div>

    </div>
  );
};
export default EventItem;
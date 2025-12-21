import { useNavigate } from "react-router-dom";
import "../styles/Pricing.css";

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="pricing-page fade-in">
      <h1>Simple, honest pricing</h1>
      <p className="subtitle">No trials. No fake tiers.</p>

      <div className="plans">
        <div className="plan">
          <h2>Monthly</h2>
          <p className="price">₹499</p>
          <p className="period">per month</p>
          <ul>
            <li>Unlimited API calls</li>
            <li>Memory + Vector + Graph</li>
            <li>Safety layer included</li>
          </ul>
          <button onClick={() => navigate("/payment?plan=monthly")}>
            Choose Monthly
          </button>
        </div>

        <div className="plan highlight">
          <h2>Yearly</h2>
          <p className="price">₹4999</p>
          <p className="period">per year</p>
          <ul>
            <li>Everything in Monthly</li>
            <li>2 months free</li>
            <li>Priority access</li>
          </ul>
          <button onClick={() => navigate("/payment?plan=yearly")}>
            Choose Yearly
          </button>
        </div>
      </div>

      <p className="footnote">
        Fair usage policy applies. Abuse leads to suspension.
      </p>
    </div>
  );
}

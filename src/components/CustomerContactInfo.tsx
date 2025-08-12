import { Link } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export default function CustomerContactInfo() {
  const { user, loading } = useUser();

  if (loading || !user) return null;

  const emailStatus = user.emailVerified ? " (Confirmed)" : " (Unconfirmed)";
  const emailColor = user.emailVerified ? "#4CAF50" : "#BA1717"; // green / red

  return (
    <div className='customer-contact-info-wrapper'>
      <div className='customer-contact-info-container'>
        <h1>Contact information</h1>

        <div className='customer-phone-number'>
          <div>
            <p>Phone number</p>
            <p>
              <span className='dot-status'></span> +{user.phone}
            </p>
          </div>
          <div>
            <Link to='/change-phone'>
              <img src='src/assets/icons/edit-note-icon.svg' alt='editNote' />
            </Link>
          </div>
        </div>

        <div className='customer-email'>
          <div>
            <p>
              Email{" "}
              <span
                className='verification-status'
                style={{ color: emailColor }}
              >
                {emailStatus}
              </span>
            </p>
            <p>
              <span className='dot-status'></span> {user.email}
            </p>
          </div>
          <div>
            <Link to='/change-email'>
              <img src='src/assets/icons/edit-note-icon.svg' alt='editNote' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

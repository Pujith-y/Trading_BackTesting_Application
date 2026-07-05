import "./Card.css";

function Card({ title, content, icon, footer }) {
  return (
    <div className="tv-card">
      {icon && <div className="tv-card__icon">{icon}</div>}

      <div className="tv-card__body">
        <h3 className="tv-card__title">{title}</h3>
        <p className="tv-card__content">{content}</p>
      </div>

      {footer && <div className="tv-card__footer">{footer}</div>}
    </div>
  );
}

export default Card;
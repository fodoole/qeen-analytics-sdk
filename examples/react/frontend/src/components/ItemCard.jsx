import Card from "react-bootstrap/Card";
import CartModal from "./CartModal";
const ItemCard = ({ item }) => {
  return (
    <Card style={cardStyles}>
      <Card.Img variant="top" src={item.image} style={cardImageStyles} />
      <Card.Body>
        <a
          href={`/products/${item.id}`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <Card.Title style={cardTitleStyles} id="name">{item.name}</Card.Title>
        </a>
        <Card.Text style={{ marginBottom: "5px" }}>{item.price} JD</Card.Text>
        <div className="tags" style={tagsStyles}>
          {item.tags.map((tag) => (
            <Card.Link href={`/tags/${tag.id}`} key={tag.id}>
              #{tag.tagname}
            </Card.Link>
          ))}
        </div>
        <CartModal item={item} />
      </Card.Body>
    </Card>
  );
};

const cardStyles = {
  textAlign: "center",
  height: "22rem",
  minWidth: "14rem",
  maxWidth: "14rem",
  padding: "20px 5px 0px 5px",
  margin: "auto",
  textDecoration: "none",
};

const cardImageStyles = {
  width: "auto",
  height: "8rem",
  marginInline: "auto",
};
const cardTitleStyles = {
  marginBottom: "5px",
  height: "3rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "normal", // allow wrapping
  display: "-webkit-box", // required for WebKit/Blink
  WebkitLineClamp: 2, // limit to 2 lines
  WebkitBoxOrient: "vertical",
};

const tagsStyles = {
  marginBottom: "5px",
  height: "1.5em", // twice the line height of the title
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "normal", // allow wrapping
  display: "-webkit-box", // required for WebKit/Blink
  WebkitLineClamp: 1, // limit to 2 lines
  WebkitBoxOrient: "vertical",
};
export default ItemCard;

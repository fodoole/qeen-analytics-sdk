import React, { useEffect, useState, useContext, createContext } from "react";
import Card from "react-bootstrap/Card";
import { useParams } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import CartModal from "../components/CartModal";
const baseurl = "http://127.0.0.1:3000";
import { usePageData } from "../components/PageDataContext"; // Import the custom hook

export const Item = () => {
  const [item, setItem] = useState(null);
  const [render, setRender] = useState(false);
  const [served, setServed] = useState(false);
  const { id } = useParams();
  const { pageData } = usePageData(); // Use the context
  const [values, setValues] = useState({
    name: "",
    description: "",
  });

  // Original Content
  useEffect(() => {
    axios
      .get(`${baseurl}/api/products/${id}`)
      .then((res) => {
        setItem(res.data);
        setRender(true);
      })
      .catch((err) => console.log(err));
  }, []);

  // Original Content or qeen Content
  useEffect(() => {
    if (render) {
      try {
        setValues({
          name: pageData.contentSelectors["#name"],
          description: pageData.contentSelectors["#description"],
        });
      } catch (e) {
        console.info(e);
        setValues({
          name: item.name,
          description: item.description,
        });
      }
      // To check rendering values.
      setServed(true);

      //Bind custom click and scroll events in the child component
      qeen.bindClickEvents([new qeen.InteractionEvent("NAME", "#name")]);

      qeen.bindScrollEvents([
        new qeen.InteractionEvent("DESCRIPTION", "#description"),
      ]);
    }
  }, [render]);

  useEffect(() => {
    if (served) {
      console.log(
        "Rendered value:",
        values.name,
        "\nDescription:",
        values.description
      );

      if (
        // Check if it was succesfully rendered
        values["name"] != item.name &&
        values["description"] != item.description
      ) {
        qeen.setContentServed();
        console.log("contentServed");
      } else {
        qeen.resetContentServed();
        console.log("originalServed");
      }
    }
  }, [served]);

  // Use the pageData prop as needed
  return (
    <Container fluid style={{ minHeight: "100vh" }}>
      {item ? (
        <Card style={cardStyles}>
          <Row>
            <h1 style={cardTitleStyles} id="name">
              {values.name}
            </h1>
            <Col className="left" sm={4} style={leftStyles}>
              <Card.Img src={item.image} style={cardImageStyles} />
              <Card.Text style={priceStyles}>{item.price} JD</Card.Text>
              <CartModal item={item} />
            </Col>
            <Col sm={8}>
              <p id="description">{values.description}</p>
              <div className="tags" style={tagsStyles}>
                {item.tags.map((tag) => (
                  <Card.Link href={`/tags/${tag.id}#qeen-dev`} key={tag.id}>
                    #{tag.tagname}
                  </Card.Link>
                ))}
              </div>
            </Col>
          </Row>
        </Card>
      ) : (
        "loading item"
      )}
    </Container>
  );
};

const cardStyles = {
  position: "reative",
  top: "10vh",
  minHeight: "26rem",
  maxWidth: "800px",
  padding: "20px",
  margin: "auto",
};

const leftStyles = {
  textAlign: "center",
  marginBottom: "20px",
};

const cardImageStyles = {
  width: "auto",
  marginInline: "auto",
  height: "10rem",
  display: "block",
};

const priceStyles = {
  fontSize: "28px",
  marginBottom: "10px",
  marginTop: "10px",
};

const buttonStyles = {
  marginBottom: "20px",
};
const cardTitleStyles = {
  margin: "10px 0px 40px",
  fontSize: "26px",
};

const tagsStyles = {
  marginBottom: "5px",
};

export default Item;

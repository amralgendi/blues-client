import { Card, Icon } from "semantic-ui-react";
import { ITodoData } from "../interfaces/todos";
interface ITodoCardProps {
  todo: ITodoData;
  handleDelete: (id: string) => void;
}
const TodoCard = ({
  todo: {
    title: header,
    description,
    startDate,
    endDate,
    _id: id,
    status,
    priority,
  },
  handleDelete,
}: ITodoCardProps) => {
  const meta = `from ${new Date(startDate).toLocaleDateString()} to ${new Date(
    endDate
  ).toLocaleDateString()}`;
  const progressBar =
    priority === "Low" ? "27%" : priority === "Medium" ? "54%" : "81%";
  const progressBarColor =
    priority === "Low" ? "green" : priority === "Medium" ? "yellow" : "red";
  return (
    <Card color="teal" fluid>
      <Card.Content>
        <Card.Header>{header}</Card.Header>
        <Card.Meta textAlign="center">{meta}</Card.Meta>
        <Card.Description fluid textAlign="left">
          {description}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div className="card-buttons">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              Status: <strong>{status}</strong>
            </div>
            <div className="progressbar">
              <div
                style={{
                  width: progressBar,
                  backgroundColor: progressBarColor,
                }}
              ></div>
            </div>
            <div className="priority-description">{priority} Priority</div>
          </div>
          <div>
            <Icon size="large" link to="/" name="edit" />
            <Icon
              size="large"
              link
              to="/signin"
              name="delete"
              onClick={() => handleDelete(id)}
            />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default TodoCard;

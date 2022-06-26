import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div
      style={{
        height: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
      }}
    >
      <div className="font-full-screen">Page not Found</div>
      <div className="font-full-row">
        Go to <Link to="/">Home</Link>?
      </div>
    </div>
  );
};

export default Error;

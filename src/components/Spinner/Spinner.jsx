import "./Spinner.css";

import { InfinitySpin } from "react-loader-spinner";

const Spinner = () => {
  return (
    <div className="spinner-wrapper">
      <InfinitySpin color="#0445fc" />
    </div>
  );
};

export default Spinner;

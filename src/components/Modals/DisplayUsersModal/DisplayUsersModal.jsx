import "../Modals.css";

import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

import { useClickOutside } from "../../../custom-hooks";
import ProfileCard from "../../ProfileCard/ProfileCard";

const DisplayUsersModal = ({ info, modalClose }) => {
  const { allUsers } = useSelector((state) => state.users);
  const nodeRef = useClickOutside(() => modalClose());
  return (
    <div className="modal-wrapper">
      <div className="modal" ref={nodeRef}>
        <div className="flex jc-space-b">
          <h3 className="modal-title">{info.title}</h3>
          <div className="modal-close-btn" onClick={modalClose}>
            <FaTimes />
          </div>
        </div>
        <div className="modal-body p-x-0 p-s">
          {info.users.map((user) => (
            <ProfileCard
              key={allUsers[user]?.id}
              profile={allUsers[user]}
              type="modal"
              handler={modalClose}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayUsersModal;

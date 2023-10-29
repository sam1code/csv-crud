import React, { useState } from "react";

const Modal = ({ data, modalFor, handleSubmit, handleClose }) => {
  const [tempData, setTempData] = useState(
    modalFor?.type === "edit" ? data[modalFor.index] : {}
  );

  return (
    <div className="modal">
      <div className="modal-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#f1f1f1",
            padding: "0 2rem",
          }}
        >
          <h2>{modalFor?.type === "edit" ? "Edit Data" : "Add New Data"}</h2>

          <span className="close" onClick={handleClose}>
            &times;
          </span>
        </div>
        <div className="modal-body">
          <form
            onSubmit={() => {
              handleSubmit(tempData, modalFor?.index, modalFor?.type);
            }}
          >
            <div className="form">
              {data.length > 0 &&
                Object.keys(data[0]).map((item) => (
                  <div key={item} className="form-group">
                    <label htmlFor={item}>{item}</label>
                    <input
                      type={(() => {
                        if (item === "Email") return "email";
                        else if (item === "Phone") return "number";
                        else return "text";
                      })()}
                      id={item}
                      name={item}
                      defaultValue={
                        modalFor?.type === "edit"
                          ? data[modalFor.index][item]
                          : ""
                      }
                      onChange={(e) => {
                        setTempData({
                          ...tempData,
                          [item]: e.target.value,
                        });
                      }}
                    />
                  </div>
                ))}
            </div>
            <div className="btn-div">
              <button type="submit" className="btn">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;

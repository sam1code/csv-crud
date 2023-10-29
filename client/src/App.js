import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";
import Modal from "./Modal";

const URL = "http://localhost:8080/data";

const CRUDComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalFor, setModalFor] = useState({
    index: -1,
    type: "",
  });

  const getData = async (csv, reset) => {
    try {
      setLoading(true);
      const response = await axios.get(URL + "?csv=" + csv + "&reset=" + reset);
      if (csv === true) {
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "data.csv");
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        setData(response.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (ind) => {
    console.log("handleEdit", ind);
    setModalFor({
      index: ind,
      type: "edit",
    });
  };

  const handleAdd = () => {
    console.log("handleAdd");
    setModalFor({
      index: -1,
      type: "add",
    });
  };

  const handleDelete = async (ind) => {
    try {
      const resp = await axios.delete(URL + "?ind=" + ind);
      setData(resp.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const exportCSV = () => {
    getData(true);
  };

  const handleClose = () => {
    setModalFor({
      index: -1,
      type: "",
    });
  };

  useEffect(() => {
    console.log("useEffect");
    getData();
  }, []);

  const handleSubmit = async (tempData, ind, type) => {
    if (type === "edit") {
      try {
        const resp = await axios.put(URL + "?ind=" + ind, tempData);
        setData(resp.data?.data);
        handleClose();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const resp = await axios.post(URL, tempData);
        setData(resp.data?.data);
        handleClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      {modalFor.type && (
        <Modal
          data={data}
          modalFor={modalFor}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
        />
      )}
      {loading && <h1>Loading...</h1>}
      <h1>Excel Backend CRUD</h1>
      <div>
        <button className="btn mr-10" onClick={handleAdd}>
          Add New Data
        </button>
        <button className="btn mr-10" onClick={getData}>
          Refresh
        </button>
        <button className="btn mr-10" onClick={() => getData(false, true)}>
          Reset
        </button>
        <button className="btn mr-10" onClick={exportCSV}>
          Export
        </button>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>User Name</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, ind) => (
            <tr key={item?.Email}>
              {data.length > 0 &&
                Object.values(item).map((value) => (
                  <td key={value}>{value}</td>
                ))}
              <td>
                <button onClick={() => handleEdit(ind)} className="btn mr-2">
                  Edit
                </button>
                <button onClick={() => handleDelete(ind)} className="btn">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CRUDComponent;

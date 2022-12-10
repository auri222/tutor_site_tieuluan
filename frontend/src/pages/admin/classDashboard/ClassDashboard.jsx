import "./classDashboard.css";
import React from "react";
import { useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import { useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


const ClassDashboard = () => {
  const [total, setTotal] = useState(0);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/class");
        setClasses(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClass();
  }, []);

  useEffect(() => {setTotal(classes.length)}, [classes])

  const handleClick = () => {
    navigate('/dashboard/class/create');
  }

  const handleEdit = (id) => {
    navigate(`/dashboard/class/edit/${id}`);
  }

  return (
    <div className="classesDB">
      <Sidebar />
      <div className="classesDBContainer">
        <DashboardNav />
        <div className="classesDBWrapper">
          <div className="classesDBTitle">Dữ liệu lớp học</div>

          <div className="classesDBOption">
          <div className="classesDBTotal">Tổng số: {total}</div>
          <div className="classesDBCreate">
            <button className="btn btn-primary py-2" onClick={handleClick}>Thêm dữ liệu</button>
          </div>
          </div>
          

          <table className="table table-bordered table-responsive">
            <thead>
              <tr>
                <th scope="col">STT</th>
                <th scope="col">Tên lớp</th>
                <th scope="col">Mã viết tắt</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {classes.length > 0
                ? classes.map((item, index) => (
                    <tr key={item._id}>
                      <td>{index+1}</td>
                      <td>{item.name}</td>
                      <td>{item.code}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-info mx-2"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="CLick để sửa"
                          onClick={() => {handleEdit(item._id)}}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                        {/* <button
                          type="button"
                          className="btn btn-danger mx-2"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="CLick để xóa"
                        >
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button> */}
                      </td>
                    </tr>
                  ))
                : ""}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassDashboard;

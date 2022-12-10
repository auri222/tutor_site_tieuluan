import './createSubjectDB.css';
import React from 'react'
import { useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import DashboardNav from "../../../components/dashboardNav/DashboardNav";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const CreateSubjectDB = () => {
  const [data, setData] = useState({
    name: "",
    code: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState({});

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let isValidate = true;
    let err = {};

    if (data.name === "") {
      isValidate = false;
      err["name"] = "Hãy nhập tên môn!";
    }

    if (data.name.startsWith("Môn")) {
      isValidate = false;
      err["name"] = "Bạn không cần nhập chữ Môn cho môn cần thêm";
    }

    if (data.code === "") {
      isValidate = false;
      err["code"] = "Hãy nhập mã môn!";
    }

    if (data.code.startsWith("M") === false) {
      isValidate = false;
      err["code"] = "Hãy nhập mã môn bắt đầu bằng từ M!";
    }

    setError(err);
    return isValidate;
  };

  //Show list errors
  const errorArr = Object.keys(error).map((k, i) => (
    <li key={i}>{error[k]}</li>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) {
        const res = await axios.post(
          "http://localhost:8000/api/subject/create",
          { data: data },
          { withCredentials: true }
        );
        if (res.data.success) {
          Swal.fire({
            title: "Hoàn thành",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Xong",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/dashboard/subject`, {
                replace: true,
              }); //replace: true => cannot going back to this page
            }
          });
        }
      }
    } catch (error) {
      if (!error.response.data.success) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "" + error.response.data.message,
        });
      }
    }
  };

  return (
    <div className="subjectDB">
      <Sidebar />
      <div className="subjectDBContainer">
        <DashboardNav />
        <div className="subjectDBWrapper">
          <div className="subjectDBTitle">Thêm dữ liệu môn học</div>

          <div className="subjectDBForm">
            <form>
              <div className="row mb-3">
                <div className="col-md-6">
                  <label htmlFor="name">Tên môn học</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Toán"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="code">Mã môn học</label>
                  <input
                    type="text"
                    id="code"
                    className="form-control"
                    placeholder="MT"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-12">
                  {Object.keys(error).length !== 0 ? (
                      <div className="alert alert-warning mb-3" role="alert">
                        {errorArr}
                      </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              <button
                className="btnCreateSubjectDB"
                type="submit"
                onClick={handleSubmit}
              >
                Thêm dữ liệu
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateSubjectDB
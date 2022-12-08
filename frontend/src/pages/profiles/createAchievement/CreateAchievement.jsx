import "./createAchievement.css";
import React from "react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import imgIcon from "../../../assets/imgs/icons8-google-images-128.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";
import Swal from "sweetalert2";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useState } from "react";

const CreateAchievement = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [achievement, setAchievement] = useState({
    achievement_name: "",
    achievement_accomplished_date: null,
    achievement_from: "",
  });
  const [achievementImg, setAchievementImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [fileInfo, setFileInfo] = useState({
    type: "",
    size: 0,
  });

  const handleAchievementImgChange = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      setFileInfo({ ...fileInfo, size: file.size, type: file.type });
      const reader = new FileReader();
      reader.onload = () => {
        setAchievementImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeAchievement = (e) => {
    setAchievement({ ...achievement, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    let isValidate = true;
    let err = {};
    let arrType = ["image/jpg", "image/jpeg", "image/png"];

    if (achievement.achievement_name === "") {
      isValidate = false;
      err["achievement_name"] = "Hãy nhập tên bằng cấp!";
    }

    if (achievement.achievement_from === "") {
      isValidate = false;
      err["achievement_name"] = "Hãy nhập nơi cấp!";
    }

    if (achievement.achievement_accomplished_date === null) {
      isValidate = false;
      err["achievement_accomplished_date"] = "Hãy chọn ngày cấp!";
    }

    if (achievementImg === "") {
      isValidate = false;
      err["achievement_image"] = "Hãy chọn hình bằng cấp!";
    } else if (fileInfo.size > 2097152) {
      isValidate = false;
      err["achievement_image"] = "File ảnh quá lớn, hãy chọn ảnh khác!";
    } else if (!arrType.includes(fileInfo.type)) {
      isValidate = false;
      err["achievement_image"] = "Hãy chọn file ảnh có đuôi .jpg, .jpeg, .png!";
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
      setLoading(true);
      if (validateForm()) {
        const res = await axios.post(
          "http://localhost:8000/api/tutor_achievement/create",
          {
            accountID: user._id,
            achievement: achievement,
            achievementImg: achievementImg,
          },
          { withCredentials: true }
        );
        if(res.data.success){
          setLoading(false);
          Swal.fire({
            title: "Hoàn thành",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Xong",
          }).then((result) => {
            if(result.isConfirmed){
              navigate(`/profile/${user._id}`, {replace:true});
            }
          });
        }
      }
    } catch (error) {
      if(!error.response.data.success){
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: ''+error.response.data.message,
        });
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <section className="cAContainer py-4">
        {loading && (
          <div className="loader">
            <ScaleLoader
              color="rgba(126, 208, 240, 1)"
              loading={loading}
              size={50}
            />
            <span>Đang xử lý. Hãy đợi một tí ...</span>
          </div>
        )}
        <div className="container">
          <div className="cAFWrapper">
            <h2 className="cATitle">Thêm thông tin thành tích (bằng cấp)</h2>
            <hr />
            {user === null ? (
              "Bạn không được phép vào trang này!"
            ) : user?.accountType === "TUTOR" ? (
              <form className="cAForm">
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3 imgWrapper">
                      {achievementImg !== "" ? (
                        <img
                          src={achievementImg}
                          alt="Anh mau"
                          id="achievement_image"
                          className="achievementImg rounded mx-auto d-block"
                        />
                      ) : (
                        <img
                          src={imgIcon}
                          alt="Anh mau"
                          id="achievement_image"
                          className="rounded mx-auto d-block img-fluid"
                        />
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="achievement_img">Ảnh bằng cấp</label>
                      <input
                        type="file"
                        id="achievement_img"
                        className="form-control"
                        onChange={handleAchievementImgChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="achievement_name">
                        Tên bằng cấp (chứng nhận)
                      </label>
                      <input
                        type="text"
                        id="achievement_name"
                        className="form-control"
                        placeholder="Nhập tên bằng cấp hay chứng nhận"
                        onChange={handleChangeAchievement}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="achievement_from">Tên nơi cấp</label>
                      <input
                        type="text"
                        id="achievement_from"
                        className="form-control"
                        placeholder="Nhập tên nơi cấp"
                        onChange={handleChangeAchievement}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="achievement_accomplished_date">
                        Ngày cấp
                      </label>
                      <input
                        type="date"
                        id="achievement_accomplished_date"
                        className="form-control"
                        onChange={handleChangeAchievement}
                      />
                    </div>
                    {Object.keys(error).length !== 0 ? (
                      <div className="mb-3">
                        <div className="alert alert-warning mb-3" role="alert">
                          {errorArr}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="mb-3">
                      <button
                        className="fButton"
                        type="submit"
                        onClick={handleSubmit}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              "Bạn không được phép vào trang này!"
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CreateAchievement;

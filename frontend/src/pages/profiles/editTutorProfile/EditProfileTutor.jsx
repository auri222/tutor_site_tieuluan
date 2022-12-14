import "./editTutorProfile.css";
import { useContext, useState } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const EditProfileTutor = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  //Update state
  const [newProfile, setNewProfile] = useState({
    tutor_name: "",
    tutor_title: "",
    tutor_occupation: "",
    tutor_workplace_name: "",
    tutor_workplace_address: "",
  });
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [error, setError] = useState({});
  const [profileImg, setProfileImg] = useState("");
  const [CCCDImg, setCCCDImg] = useState([]);
  const [updatedProfileImg, setUpdatedProfileImg] = useState(false);
  const [updatedCCCDImg, setUpdatedCCCDImg] = useState(false);
  const [loadCCCD, setLoadCCCD] = useState(false);
  const [loading, setLoading] = useState(false);

  //Load state
  const [oldProfile, setOldProfile] = useState({});
  const [subjects, setSubjects] = useState([]); //load
  const [schedules, setSchedules] = useState([]); //load
  const [classes, setClasses] = useState([]); //Load data classes

  useEffect(() => {
    const fetchClass = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/class");
        setClasses(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSubject = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/subject");
        setSubjects(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSchedule = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/schedule");
        setSchedules(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const loadTutorProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/tutors/${id}`, {
          withCredentials: true,
        });
        // console.log(res.data);
        if (res.data) {
          setOldProfile(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchClass();
    fetchSubject();
    fetchSchedule();
    loadTutorProfile();
  }, [id]);

  const handleSelectClasses = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedClasses(
      checked
        ? [...selectedClasses, value]
        : selectedClasses.filter((item) => item !== value)
    );
  };

  const handleSelectSubjects = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedSubjects(
      checked
        ? [...selectedSubjects, value]
        : selectedSubjects.filter((item) => item !== value)
    );
  };

  const handleSelectSchedule = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedSchedules(
      checked
        ? [...selectedSchedules, value]
        : selectedSchedules.filter((item) => item !== value)
    );
  };

  const handleChange = (e) => {
    setNewProfile({ ...newProfile, [e.target.id]: e.target.value });
  };

  const handleChangeProfileImg = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
        setUpdatedProfileImg(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeCCCDImg = (e) => {
    if (e.target.files.length !== 0) {
      const files = Array.from(e.target.files || []);
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setCCCDImg((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
      setUpdatedCCCDImg(true);
    }
  };

  useEffect(() => {
    setNewProfile((prev) => ({
      ...prev,
      tutor_name: oldProfile?.tutor_name,
      tutor_title: oldProfile?.tutor_title,
      tutor_occupation: oldProfile?.tutor_occupation,
      tutor_workplace_name: oldProfile?.tutor_workplace_name,
      tutor_workplace_address: oldProfile?.tutor_workplace_address,
    }));

    setProfileImg(oldProfile?.tutor_profile_image || "");
    setCCCDImg(oldProfile?.tutor_CCCD_image || []);
    setSelectedClasses(oldProfile?.tutor_classes || []);
    setSelectedSchedules(oldProfile?.tutor_schedule || []);
    setSelectedSubjects(oldProfile?.tutor_subjects || []);

    if (oldProfile?.tutor_CCCD_image) {
      if (oldProfile?.tutor_CCCD_image.length === 0) {
        setLoadCCCD(true);
      }
    }
  }, [oldProfile]);

  const validatedForm = () => {
    let isValidate = true;
    let err = {};

    if (newProfile.tutor_name === "") {
      isValidate = false;
      err["tutor_name"] = "H??y nh???p h??? t??n!";
    }
    if (newProfile.tutor_occupation === "") {
      isValidate = false;
      err["tutor_occupation"] = "H??y nh???p ngh??? nghi???p hi???n t???i!";
    }
    if (newProfile.tutor_workplace_name === "") {
      isValidate = false;
      err["tutor_workplace_name"] = "H??y nh???p t??n n??i l??m vi???c!";
    }

    if (selectedClasses.length === 0) {
      isValidate = false;
      err["tutor_classes"] = "H??y ch???n l???p gi???ng d???y!";
    }

    if (selectedSubjects.length === 0) {
      isValidate = false;
      err["tutor_subjects"] = "H??y ch???n m??n gi???ng d???y!";
    }

    if (selectedSchedules.length === 0) {
      isValidate = false;
      err["tutor_schedules"] = "H??y ch???n l???ch gi???ng d???y!";
    }

    setError(err);

    return isValidate;
  };

  const errorArr = Object.keys(error).map((k, i) => (
    <li key={i}>{error[k]}</li>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (validatedForm()) {
        const res = await axios.put(`http://localhost:8000/api/tutors/edit/${user._id}`, 
        {
          tutor: newProfile,
          classes: selectedClasses,
          subjects: selectedSubjects,
          schedules: selectedSchedules,
          profileImg: updatedProfileImg? profileImg: "",
          CCCDImg: updatedCCCDImg? CCCDImg : []
        },
        {withCredentials:true});

        if(res.data.success){
          setLoading(false);
          Swal.fire({
            title: "Ho??n th??nh",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Xong",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/profile/${user._id}`, {replace: true})
            }
          });
        }
      }
    } catch (error) {
      if(!error.response.data.success){
        Swal.fire({
          icon: 'error',
          title: 'L???i',
          text: ''+error.response.data.message,
        });
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Navbar />
      <section className="editTutorProfileContainer">
        {loading && (
          <div className="loader">
            <ScaleLoader
              color="rgba(126, 208, 240, 1)"
              loading={loading}
              size={50}
            />
            <span>??ang x??? l??. H??y ?????i m???t t?? ...</span>
          </div>
        )}
        <div className="container">
          <div className="eTPWrapper">
            <h2 className="tPEditTitle">S???a th??ng tin gia s??</h2>
            {id === user?._id ? (
              <form className="tPEditForm">
                {/* Tai khoan */}
                <div className="row ">
                  <hr />
                  <div className="col-md-4">
                    <h4 className="fPartTitle">Th??ng tin c?? nh??n</h4>
                  </div>
                  <div className="col-md-8">
                    <div className="row mb-3">
                      <div className="col-md-4">
                        <label htmlFor="tutor_name">H??? t??n</label>
                        <input
                          type="text"
                          id="tutor_name"
                          className="form-control"
                          placeholder="Nh???p h??? t??n"
                          value={newProfile?.tutor_name || ""}
                          required
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="tutor_title">Ch???c danh</label>
                        <input
                          type="text"
                          id="tutor_title"
                          className="form-control"
                          placeholder="Nh???p ch???c danh"
                          value={newProfile?.tutor_title || ""}
                          required
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="tutor_occupation">Ngh??? nghi???p</label>
                        <input
                          type="text"
                          id="tutor_occupation"
                          className="form-control"
                          placeholder="Nh???p ngh??? nghi???p"
                          value={newProfile?.tutor_occupation || ""}
                          required
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="tutor_workplace_name">
                          N??i l??m vi???c (h???c t???p) hi???n t???i
                        </label>
                        <input
                          type="text"
                          id="tutor_workplace_name"
                          className="form-control"
                          placeholder="Nh???p t??n n??i l??m vi???c"
                          value={newProfile?.tutor_workplace_name || ""}
                          required
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="tutor_workplace_address">
                          Ngh??? nghi???p
                        </label>
                        <input
                          type="text"
                          id="tutor_workplace_address"
                          className="form-control"
                          placeholder="Nh???p ngh??? nghi???p"
                          value={newProfile?.tutor_workplace_address || ""}
                          required
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>

                {/* Lien he */}
                <div className="row">
                  <div className="col-md-4">
                    <h4 className="fPartTitle">Th??ng tin gi???ng d???y</h4>
                  </div>
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="classes">L???p gi???ng d???y</label> <br />
                      {classes ? (
                        <>
                          {classes.map((item) => (
                            <div
                              id="classes"
                              key={item._id}
                              className="form-check form-check-inline"
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={handleSelectClasses}
                                checked={
                                  selectedClasses.includes(item.name)
                                    ? true
                                    : false
                                }
                                value={item.name}
                              />
                              <label className="form-check-label">
                                {item.name}
                              </label>
                            </div>
                          ))}
                        </>
                      ) : (
                        "Kh??ng c?? d??? li???u"
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="subjects">M??n gi???ng d???y</label> <br />
                      {subjects ? (
                        <>
                          {subjects.map((item) => (
                            <div
                              id="subjects"
                              key={item._id}
                              className="form-check form-check-inline"
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={handleSelectSubjects}
                                checked={
                                  selectedSubjects.includes(item.name)
                                    ? true
                                    : false
                                }
                                value={item.name}
                              />
                              <label className="form-check-label">
                                {item.name}
                              </label>
                            </div>
                          ))}
                        </>
                      ) : (
                        "Kh??ng c?? d??? li???u"
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="schedule">L???ch gi???ng d???y</label> <br />
                      {schedules ? (
                        <>
                          {schedules.map((item) => (
                            <div
                              id="schedule"
                              key={item._id}
                              className="form-check form-check-inline"
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={handleSelectSchedule}
                                checked={
                                  selectedSchedules.includes(item.name)
                                    ? true
                                    : false
                                }
                                value={item.name}
                              />
                              <label className="form-check-label">
                                {item.name}
                              </label>
                            </div>
                          ))}
                        </>
                      ) : (
                        "Kh??ng c?? d??? li???u"
                      )}
                    </div>
                  </div>
                  <hr />
                </div>

                {/* Thong tin ca nhan */}
                <div className="row">
                  <div className="col-md-4">
                    <h4 className="fPartTitle">S???a ???nh</h4>
                  </div>
                  <div className="col-md-8">
                    {profileImg ? (
                      <div className="mb-3">
                        <img
                          src={profileImg}
                          className="rounded mx-auto d-block pTImg"
                          alt="H??nh gia s??"
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="mb-3">
                      <label htmlFor="profileImg">???nh ?????i di???n</label>
                      <input
                        type="file"
                        id="profileImg"
                        className="form-control"
                        onChange={handleChangeProfileImg}
                        required
                      />
                    </div>

                    {!loadCCCD ? (
                      <span></span>
                    ) : (
                      <>
                        <div className="mb-3">
                          <label htmlFor="CCCDImg">???nh CCCD</label>
                          <input
                            type="file"
                            id="CCCDImg"
                            className="form-control"
                            onChange={handleChangeCCCDImg}
                            multiple
                          />
                        </div>
                        <div className="mb-3">
                          <div className="row">
                            {CCCDImg.map((item, index) => (
                              <div className="col-md-6" key={index}>
                                <img
                                  src={item}
                                  className="rounded mx-auto d-block pTCCCDImg"
                                  alt="H??nh CCCD"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <hr />
                </div>
                {Object.keys(error).length !== 0 ? (
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-8">
                      <div className="mb-3">
                        <div className="alert alert-warning mb-3" role="alert">
                          {errorArr}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <button
                  className="fButton"
                  type="submit"
                  onClick={handleSubmit}
                >
                  S???a th??ng tin
                </button>
              </form>
            ) : (
              "C???nh b??o: B???n kh??ng ???????c ph??p v??o trang n??y!"
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default EditProfileTutor;

import "./registerTutor.css";
import { useState, useEffect, useContext } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import axios from "axios";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import ScrollTop from "../../../components/scrollTop/ScrollTop";

const RegisterTutorCourse = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { state } = useLocation();
  const { tutor } = state || "";
  const navigate = useNavigate();

  //Register tutor
  const [course, setCourse] = useState({
    course_name: "",
    course_requirement: "",
    course_time: "",
  });
  const [address, setAddress] = useState({
    home_number: "",
    street: "",
    ward: "",
    district: "",
    province: "",
  });
  const [addrOption, setAddrOption] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [error, setError] = useState({});

  //Load
  const [subjects, setSubjects] = useState([]); //load
  const [schedules, setSchedules] = useState([]); //load
  const [classes, setClasses] = useState([]); //Load data classes
  const [provinces, setProvinces] = useState([]); //load
  const [districts, setDistricts] = useState([]); //load
  const [wards, setWards] = useState([]); //load

  // Load data when page load
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/location/provinces"
        );
        setProvinces(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProvinces();

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

    fetchClass();
    fetchSubject();
    fetchSchedule();
  }, []);

  const handleCourseChange = (e) => {
    setCourse({ ...course, [e.target.id]: e.target.value });
  };

  const handleAddrOptionChange = (e) => {

    setAddrOption(!addrOption);
  };

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.id]: e.target.value });
  };

  const handleProvinceChange = (e) => {
    setAddress({
      ...address,
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text,
    });
    const code = e.target.value;

    const fetchDistrict = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/location/districts?parent_code=${code}`
        );
        setDistricts(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDistrict();
  };

  const handleDistrictChange = (e) => {
    setAddress({
      ...address,
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text,
    });
    const code = e.target.value;

    const fetchWard = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/location/wards?parent_code=${code}`
        );
        setWards(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchWard();
  };

  const handleWardChange = (e) => {
    setAddress({
      ...address,
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text,
    });
  };

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

  const handleSelectSchedules = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedSchedules(
      checked
        ? [...selectedSchedules, value]
        : selectedSchedules.filter((item) => item !== value)
    );
  };

  const validateForm = () => {
    let err = {};
    let isValidate = true;

    //Check course name, course time
    if (course.course_name === "") {
      isValidate = false;
      err["course_name"] = "H??y nh???p t??n l???p h???c.";
    }

    if (course.course_time === "") {
      isValidate = false;
      err["course_time"] = "H??y nh???p gi??? h???c.";
    }

    //Check course schedule, class, subject
    if (selectedClasses.length === 0) {
      isValidate = false;
      err["course_classes"] = "H??y ch???n l???p h???c.";
    }
    if (selectedSubjects.length === 0) {
      isValidate = false;
      err["course_subjects"] = "H??y ch???n m??n h???c.";
    }
    if (selectedSchedules.length === 0) {
      isValidate = false;
      err["course_schedules"] = "H??y ch???n l???ch h???c.";
    }

    //Check address, addrOption
    if (addrOption === false) 
    {
      if((address.district === "" ||
      address.home_number === "" ||
      address.street === "" ||
      address.province === "" ||
      address.ward === "")){
        isValidate = false;
        err["address"] = "H??y nh???p ?????y ????? ?????a ch???.";
        console.log(address.district === "" ||
        address.home_number === "" ||
        address.street === "" ||
        address.province === "" ||
        address.ward === "");
      }
      
    }

    setError(err);

    return isValidate;
  };

  const errorArr = Object.keys(error).map((k, i) => (
    <li key={i}>
      {error[k]}
    </li>
  ))

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(validateForm()){
        const res = await axios.post(`http://localhost:8000/api/course/createPrivateCourse`, {
          user: user._id,
          tutor: id,
          course: course,
          classes: selectedClasses,
          subjects: selectedSubjects,
          schedules: selectedSchedules,
          addrOption: addrOption,
          address: address
        }, {withCredentials:true});
        if(res.data.success){
          Swal.fire({
            title: "Ho??n th??nh",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Xong",
          }).then((result) => {
            if(result.isConfirmed){
              navigate(`/courses/details/${res.data.course}`, {replace: true}); //replace: true => cannot going back to this page
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
        })
      }
    }
    
  };

  return (
    <>
      <Navbar />
      <ScrollTop />
      <section className="rTContainer">
        <div className="container">
          <div className="rTCWrapper">
            <h2 className="rTCTitle">????ng k?? kh??a h???c t??m gia s?? {tutor}</h2>
            <hr />
            {user?._id ? (
              <form className="rTCForm">
                {/* Lien he */}
                <div className="row">
                  <div className="col-md-3">
                    <h4 className="rTCFPartTitle">Chi ti???t kh??a h???c</h4>
                  </div>
                  <div className="col-md-9">
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-8">
                          <label htmlFor="course_name">T??n kh??a h???c</label>
                          <input
                            type="text"
                            id="course_name"
                            className="form-control"
                            placeholder="L???p m??n to??n cho l???p 10 ..."
                            required
                            onChange={handleCourseChange}
                          />
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="course_time">Th???i gian h???c</label>
                          <input
                            type="text"
                            id="course_time"
                            className="form-control"
                            placeholder="2h/1 bu???i"
                            required
                            onChange={handleCourseChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="course_requirement">
                        Y??u c???u cho gia s??
                      </label>
                      <textarea
                        id="course_requirement"
                        className="form-control"
                        placeholder="??i???n y??u c???u cho gia s??"
                        required
                        onChange={handleCourseChange}
                        rows="3"
                      >

                      </textarea>
                    </div>

                    {/* L???p h???c */}
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="classes">L???p h???c</label> <br />
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
                    </div>

                    {/* M??n h???c*/}
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="subjects">M??n h???c</label> <br />
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
                    </div>

                    {/* L???ch h???c*/}
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-12">
                          <label htmlFor="schedules">L???ch h???c</label> <br />
                          {schedules ? (
                            <>
                              {schedules.map((item) => (
                                <div
                                  id="schedules"
                                  key={item._id}
                                  className="form-check form-check-inline"
                                >
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={handleSelectSchedules}
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
                    </div>
                  </div>
                  <hr />
                </div>

                {/* Thong tin ca nhan */}
                <div className="row">
                  <div className="col-md-3">
                    <h4 className="rTCFPartTitle">?????a ch??? kh??a h???c</h4>
                  </div>
                  <div className="col-md-9">
                    <div className="mb-3">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="home_number">S??? nh??</label>
                          <input
                            type="text"
                            id="home_number"
                            className="form-control"
                            placeholder="S??? 123/H2"
                            onChange={handleAddressChange}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="S??? nh?? ch??? hi???n th??? cho gia s?? ???????c ch???n th??ng qua email"
                            disabled={addrOption}
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="street">T??n ???????ng</label>
                          <input
                            type="text"
                            id="street"
                            className="form-control"
                            placeholder="???????ng 3/2"
                            onChange={handleAddressChange}
                            disabled={addrOption}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label htmlFor="province">T???nh th??nh</label>
                          <select
                            id="province"
                            className="form-control"
                            onChange={handleProvinceChange}
                            defaultValue={"DEFAULT"}
                            disabled={addrOption}
                          >
                            <option value={"DEFAULT"} disabled>
                              --Ch???n t???nh th??nh--
                            </option>
                            {provinces ? (
                              provinces.map((province) => (
                                <option
                                  key={province.code}
                                  value={province.code}
                                >
                                  {province.name_with_type}
                                </option>
                              ))
                            ) : (
                              <option disabled>--Ch???n t???nh th??nh--</option>
                            )}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="district">Qu???n huy???n</label>
                          <select
                            id="district"
                            className="form-control"
                            onChange={handleDistrictChange}
                            defaultValue={"DEFAULT"}
                            disabled={addrOption}
                          >
                            <option value={"DEFAULT"} disabled>
                              --Ch???n qu???n huy???n--
                            </option>
                            {districts ? (
                              districts.map((district) => (
                                <option
                                  key={district.code}
                                  value={district.code}
                                >
                                  {district.name_with_type}
                                </option>
                              ))
                            ) : (
                              <option disabled>--Ch???n qu???n huy???n--</option>
                            )}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label htmlFor="ward">Ph?????ng x??</label>
                          <select
                            id="ward"
                            className="form-control"
                            onChange={handleWardChange}
                            defaultValue={"DEFAULT"}
                            disabled={addrOption}
                          >
                            <option value={"DEFAULT"} disabled>
                              --Ch???n ph?????ng x??--
                            </option>
                            {wards ? (
                              wards.map((ward) => (
                                <option key={ward.code} value={ward.code}>
                                  {ward.name_with_type}
                                </option>
                              ))
                            ) : (
                              <option disabled>--Ch???n ph?????ng x??--</option>
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-12">
                          <div
                            id="addrOpt"
                            className="form-check form-check-inline"
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={handleAddrOptionChange}
                              value={addrOption? 'checked': 'uncheck'}
                              
                            />
                            <label className="form-check-label">
                              Ch???n ?????a ch??? ???? l??u t??? t??i kho???n
                            </label>
                          </div>
                          <div>
                            <small>B???n s??? kh??ng c???n ph???i ??i???n th??ng tin ?????a ch??? cho kh??a h???c n???u ch???n t??y ch???n n??y.</small>
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
                
                {Object.keys(error).length !== 0? (
                  <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-9">
                      <div className="mb-3">

                      <div className="alert alert-warning mb-3" role="alert">
                        {errorArr}
                      </div>
                      </div>
                    </div>
                  </div>
                ) : ""}

                <button
                  className="fButton"
                  type="submit"
                  onClick={handleSubmit}
                >
                  ????ng k?? kh??a h???c
                </button>
              </form>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default RegisterTutorCourse;

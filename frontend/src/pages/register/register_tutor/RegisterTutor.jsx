import { useState, useEffect } from "react";
import "./register_tutor.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";
import Swal from "sweetalert2";

const Register_tutor = () => {
  const navigate = useNavigate();
  const [account, setAccount] = useState({
    username: "",
    birthday: new Date(),
    password: "",
    confirm_password: "",
    email: "",
    phone_number: "",
    CCCD: "",
    home_number: "",
    street: "",
    province: "",
    district: "",
    ward: "",
  });
  const [tutor, setTutor] = useState({
    tutor_name: "",
    tutor_title: "",
    tutor_occupation: "",
    tutor_workplace_name: "",
    tutor_workplace_address: "",
  });
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);

  const [schedule, setSchedule] = useState([]);
  const [subjects, setSubjects] = useState([]); //load
  const [classes, setClasses] = useState([]); //Load data classes
  const [provinces, setProvinces] = useState([]); //load
  const [districts, setDistricts] = useState([]); //load
  const [wards, setWards] = useState([]); //load
  // const [error, setError] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [CCCDImg, setCCCDImg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

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
        setSchedule(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchClass();
    fetchSubject();
    fetchSchedule();
  }, []);

  const handleProvinceChange = (e) => {
    setAccount({
      ...account,
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
    setAccount({
      ...account,
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
    setAccount({
      ...account,
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

  const handleSelectSchedule = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedSchedule(
      checked
        ? [...selectedSchedule, value]
        : selectedSchedule.filter((item) => item !== value)
    );
  };

  const handleChangeAccount = (e) => {
    setAccount({ ...account, [e.target.id]: e.target.value });
  };

  const handleChangeTutor = (e) => {
    setTutor({ ...tutor, [e.target.id]: e.target.value });
  };

  const handleChangeProfileImg = (e) => {
    if (e.target.files.length !== 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
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
    }
  };

  const validateForm = () => {
    let isValidate = true;
    let err = {};

    if (account.username === "") {
      isValidate = false;
      err["username"] = "H??y nh???p t??n ????ng nh???p!";
    }
    if (account.birthday === "") {
      isValidate = false;
      err["birthday"] = "H??y ch???n ng??y sinh!";
    }
    if (account.password === "") {
      isValidate = false;
      err["password"] = "H??y nh???p m???t kh???u!";
    }
    else if (account.password.length < 8) {
      isValidate = false;
      err["password"] = "M???t kh???u ph???i nhi???u h??n 8 k?? t???!";
    }
    else if (!account.password.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([\W]*).{8,}/)) {
      isValidate = false;
      err["password"] =
        "M???t kh???u ph???i nhi???u h??n 8 k?? t???, bao g???m k?? t??? in hoa, in th?????ng, s???, c?? ho???c kh??ng c?? k?? t??? ?????c bi???t: !@#$%^* ...!";
    }
    if (account.confirm_password === "") {
      isValidate = false;
      err["confirm_password"] = "H??y nh???p x??c nh???n m???t kh???u!";
    }
    if (account.confirm_password !== account.password) {
      isValidate = false;
      err["confirm_password"] = "M???t kh???u v?? x??c nh???n m???t kh???u kh??ng kh???p!";
    }
    if (account.CCCD === "") {
      isValidate = false;
      err["CCCD"] = "H??y nh???p s??? CCCD!";
    }else if(account.CCCD.length < 0 || account.CCCD.length>12){
      isValidate = false;
      err["CCCD"] = "H??y nh???p s??? CCCD h???p l???!";
    }
    if (account.email === "") {
      isValidate = false;
      err["email"] = "H??y nh???p ?????a ch??? email!";
    }
    if (
      !account.email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      )
    ) {
      isValidate = false;
      err["email"] = "H??y nh???p ?????a ch??? email h???p l???!";
    }
    if (account.phone_number === "") {
      isValidate = false;
      err["phone_number"] = "H??y nh???p s??? ??i???n tho???i!";
    }
    if (account.phone_number.length <= 0 || account.phone_number.length > 10) {
      isValidate = false;
      err["phone_number"] = "H??y nh???p s??? ??i???n tho???i h???p l???!";
    }
    if (account.home_number === "") {
      isValidate = false;
      err["home_number"] = "H??y nh???p s??? nh??!";
    }
    if (account.street === "") {
      isValidate = false;
      err["street"] = "H??y nh???p t??n ???????ng!";
    }
    if (account.ward === "") {
      isValidate = false;
      err["ward"] = "H??y ch???n ph?????ng x??!";
    }
    if (account.district === "") {
      isValidate = false;
      err["district"] = "H??y ch???n qu???n huy???n!";
    }
    if (account.province === "") {
      isValidate = false;
      err["province"] = "H??y ch???n t???nh th??nh!";
    }
    if (tutor.tutor_name === "") {
      isValidate = false;
      err["name"] = "H??y nh???p h??? t??n!";
    }
    if (tutor.tutor_occupation === "") {
      isValidate = false;
      err["occupation"] = "H??y nh???p ngh??? nghi???p hi???n t???i!";
    }
    if (selectedClasses.length < 0) {
      isValidate = false;
      err["classes"] = "H??y ch???n l???p gi???ng d???y!";
    }
    if (selectedSubjects.length < 0) {
      isValidate = false;
      err["subjects"] = "H??y ch???n m??n gi???ng d???y!";
    }
    if (selectedSchedule.length < 0) {
      isValidate = false;
      err["schedules"] = "H??y ch???n l???ch gi???ng d???y!";
    }
    if (profileImg === "") {
      isValidate = false;
      err["profileImg"] = "H??y ch???n ???nh profile!";
    }
    if (CCCDImg.length <= 0 || CCCDImg.length <= 1) {
      isValidate = false;
      err["CCCDImg"] = "H??y ch???n 2 ???nh CCCD m???t tr?????c v?? sau";
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
        setLoading(true);
        const res = await axios.post(
          `http://localhost:8000/api/auth/register-tutor`,
          {
            account: account,
            tutor: tutor,
            classes: selectedClasses,
            subjects: selectedSubjects,
            schedule: selectedSchedule,
            profileImg: profileImg,
            CCCDImg: CCCDImg,
          }
        );
        if (res.data.success) {
          setLoading(false);
          Swal.fire({
            title: "Ho??n th??nh",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "??i t???i x??c minh t??i kho???n",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/otp/${res.data.account}`);
            }
          });
        }
      }
    } catch (error) {
      if (!error.response.data.success) {
        Swal.fire({
          icon: "error",
          title: "L???i",
          text: "" + error.response.data.message,
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className="rTutor">
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
      {/* START Bootstr???p container */}
      <div className="rContainer">
        <Link to="/home" style={{ color: "inherit", textDecoration: "none" }}>
          <div className="rTLogo">TutorSite</div>
        </Link>
        <h2 className="rTitle">????ng k?? t??i kho???n cho gia s??</h2>
        <form className="rTForm">
          {/* Tai khoan */}
          <div className="row ">
            <hr />
            <div className="col-md-4">
              <h4 className="fPartTitle">T??i kho???n</h4>
            </div>
            <div className="col-md-8">
              <div className="mb-3">
                <label htmlFor="username">T??n ????ng nh???p</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  placeholder="Nh???p t??n ????ng nh???p"
                  onChange={handleChangeAccount}
                  value={account.username}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="birthday">Ng??y sinh</label>
                <input
                  type="date"
                  id="birthday"
                  className="form-control"
                  required
                  value={account.birthday}
                  onChange={handleChangeAccount}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password">M???t kh???u</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Nh???p m???t kh???u"
                  onChange={handleChangeAccount}
                  value={account.password}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirm_password">Nh???p l???i m???t kh???u</label>
                <input
                  type="password"
                  id="confirm_password"
                  className="form-control"
                  placeholder="Nh???p l???i m???t kh???u"
                  value={account.confirm_password}
                  onChange={handleChangeAccount}
                  required
                />
              </div>
            </div>
            <hr />
          </div>

          {/* Lien he */}
          <div className="row">
            <div className="col-md-4">
              <h4 className="fPartTitle">Li??n h???</h4>
            </div>
            <div className="col-md-8">
              <div className="mb-3">
                <label htmlFor="email">?????a ch??? email</label>
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  placeholder="vidu@gmail.com"
                  required
                  value={account.email}
                  onChange={handleChangeAccount}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone_number">S??? ??i???n tho???i</label>
                <input
                  type="text"
                  id="phone_number"
                  className="form-control"
                  placeholder="0834759xxx"
                  required
                  value={account.phone_number}
                  onChange={handleChangeAccount}
                />
              </div>
            </div>
            <hr />
          </div>

          {/* Thong tin ca nhan */}
          <div className="row">
            <div className="col-md-4">
              <h4 className="fPartTitle">Th??ng tin c?? nh??n</h4>
            </div>
            <div className="col-md-8">
              <div className="mb-3">
                <label htmlFor="tutor_name">H??? t??n</label>
                <input
                  type="text"
                  id="tutor_name"
                  className="form-control"
                  placeholder="Nh???p h??? t??n"
                  value={tutor.tutor_name}
                  onChange={handleChangeTutor}
                  required
                />
              </div>

              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="CCCD">S??? CCCD</label>
                    <input
                      type="text"
                      id="CCCD"
                      className="form-control"
                      placeholder="0834759xxx"
                      required
                      value={account.CCCD}
                      onChange={handleChangeAccount}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label htmlFor="tutor_CCCD_image">
                          H??nh CCCD (2 m???t)
                        </label>
                        <input
                          type="file"
                          id="tutor_CCCD_image"
                          className="form-control"
                          required
                          multiple
                          onChange={handleChangeCCCDImg}
                        />
                      </div>
                      <div className="col-md-12">
                        {CCCDImg.length > 0 && (
                          <div className="previewCCCDImg">
                            {CCCDImg.map((item, index) => (
                              <img
                                src={item}
                                key={index}
                                alt="???nh CCCD"
                                className="prevItemCCCDImg"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="home_number">S??? nh??</label>
                    <input
                      type="text"
                      id="home_number"
                      className="form-control"
                      placeholder="S??? 123/H2"
                      value={account.home_number}
                      onChange={handleChangeAccount}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="street">T??n ???????ng</label>
                    <input
                      type="text"
                      id="street"
                      className="form-control"
                      placeholder="???????ng 3/2"
                      value={account.street}
                      onChange={handleChangeAccount}
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="row">
                  <div className="col-md-4">
                    <label htmlFor="province">T???nh th??nh</label>
                    <select
                      id="province"
                      className="form-control"
                      onChange={handleProvinceChange}
                    >
                      <option selected disabled>
                        --Ch???n t???nh th??nh--
                      </option>
                      {provinces ? (
                        provinces.map((province) => (
                          <option key={province.code} value={province.code}>
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
                    >
                      <option selected disabled>
                        --Ch???n qu???n huy???n--
                      </option>
                      {districts ? (
                        districts.map((district) => (
                          <option key={district.code} value={district.code}>
                            {district.name_with_type}
                          </option>
                        ))
                      ) : (
                        <option disabled selected>
                          --Ch???n qu???n huy???n--
                        </option>
                      )}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label htmlFor="ward">Ph?????ng x??</label>
                    <select
                      id="ward"
                      className="form-control"
                      onChange={handleWardChange}
                    >
                      <option selected disabled>
                        --Ch???n ph?????ng x??--
                      </option>
                      {wards ? (
                        wards.map((ward) => (
                          <option key={ward.code} value={ward.code}>
                            {ward.name_with_type}
                          </option>
                        ))
                      ) : (
                        <option disabled selected>
                          --Ch???n ph?????ng x??--
                        </option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </div>

          {/* Th??ng tin ngh??? nghi???p */}
          <div className="row">
            <div className="col-md-4">
              <h4 className="fPartTitle">Th??ng tin v??? ngh??? nghi???p</h4>
            </div>
            <div className="col-md-8">
              {/* ???nh profile */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="tutor_profile_image">???nh ?????i di???n</label>
                    <input
                      type="file"
                      id="tutor_profile_image"
                      className="form-control"
                      onChange={handleChangeProfileImg}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    {profileImg && (
                      <div className="previewPImg">
                        <div className="prevItemPImg">
                          <img src={profileImg} alt="???nh h??? s??" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* C??ng vi???c v?? ch???c danh */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="tutor_occupation">C??ng vi???c hi???n t???i</label>
                    <input
                      type="text"
                      id="tutor_occupation"
                      className="form-control"
                      placeholder="Gi??o vi??n/sinh vi??n ..."
                      value={tutor.tutor_occupation}
                      onChange={handleChangeTutor}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="tutor_title">Ch???c danh (n???u c??)</label>
                    <input
                      type="text"
                      id="tutor_title"
                      className="form-control"
                      placeholder="Ghi ho???c b??? tr???ng"
                      value={tutor.tutor_title}
                      onChange={handleChangeTutor}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* N??i l??m vi???c v?? ?????a ch??? */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-6">
                    <label htmlFor="tutor_workplace_name">
                      T??n n??i l??m vi???c
                    </label>
                    <input
                      type="text"
                      id="tutor_workplace_name"
                      className="form-control"
                      placeholder="Nh???p t??n n??i l??m vi???c hi???n t???i"
                      onChange={handleChangeTutor}
                      value={tutor.tutor_workplace_name}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="tutor_workplace_address">
                      ?????a ch??? n??i l??m vi???c
                    </label>
                    <input
                      type="text"
                      id="tutor_workplace_address"
                      className="form-control"
                      placeholder="Nh???p ?????a ch??? n??i l??m vi???c hi???n t???i"
                      onChange={handleChangeTutor}
                      value={tutor.tutor_workplace_address}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* L???p gi???ng d???y */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-12">
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

              {/* M??n gi???ng d???y */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-12">
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

              {/* L???ch gi???ng d???y */}
              <div className="mb-3">
                <div className="row">
                  <div className="col-md-12">
                    <label htmlFor="schedule">L???ch gi???ng d???y</label> <br />
                    {schedule ? (
                      <>
                        {schedule.map((item) => (
                          <div
                            id="schedule"
                            key={item._id}
                            className="form-check form-check-inline"
                          >
                            <input
                              className="form-check-input"
                              type="checkbox"
                              onChange={handleSelectSchedule}
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
          <div className="row">
            <div className="col-md-4"></div>
            <div className="col-md-8">
              <div className="mb-3">
                {Object.keys(error).length !== 0 ? (
                  <div className="mb-3">
                    <div className="alert alert-warning mb-3" role="alert">
                      {errorArr}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <button className="fButton" type="submit" onClick={handleSubmit}>
            ????ng k??
          </button>
        </form>
      </div>
      {/* END Bootstr???p container */}
    </div>
  );
};

export default Register_tutor;

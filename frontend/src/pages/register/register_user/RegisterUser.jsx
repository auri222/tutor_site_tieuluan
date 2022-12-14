import { useState, useEffect } from "react";
import "./register_user.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ScaleLoader from "react-spinners/ScaleLoader";
import Swal from "sweetalert2";

const Register_user = () => {
  const [data, setData] = useState({
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
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) =>
    setData({ ...data, [event.target.id]: event.target.value });

  // Fetch province data
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
  }, []);

  const handleProvinceChange = (e) => {
    setData({
      ...data,
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
    setData({
      ...data,
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
    setData({
      ...data,
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text,
    });
  };

  const validateForm = () => {
    let isValidate = true;
    let err = {};

    if (data.username === "") {
      isValidate = false;
      err["username"] = "H??y nh???p t??n ????ng nh???p!";
    }
    if (data.birthday === "") {
      isValidate = false;
      err["birthday"] = "H??y ch???n ng??y sinh!";
    }
    if (data.CCCD === "") {
      isValidate = false;
      err["CCCD"] = "H??y nh???p s??? CCCD!";
    } else if(data.CCCD.length < 0 || data.CCCD.length > 12){
      isValidate = false;
      err["CCCD"] = "H??y nh???p s??? CCCD h???p l???!";
    }
    if (data.email === "") {
      isValidate = false;
      err["email"] = "H??y nh???p ?????a ch??? email!";
    }else if (
      !data.email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      )
    ) {
      isValidate = false;
      err["email"] = "H??y nh???p ?????a ch??? email h???p l???!";
    }
    if (data.phone_number === "") {
      isValidate = false;
      err["phone_number"] = "H??y nh???p s??? ??i???n tho???i!";
    }
    if (data.phone_number.length <= 0 || data.phone_number.length > 10) {
      isValidate = false;
      err["phone_number"] = "H??y nh???p s??? ??i???n tho???i h???p l???!";
    }
    if (data.home_number === "") {
      isValidate = false;
      err["home_number"] = "H??y nh???p s??? nh??!";
    }
    if (data.street === "") {
      isValidate = false;
      err["street"] = "H??y nh???p t??n ???????ng!";
    }
    if (data.ward === "") {
      isValidate = false;
      err["ward"] = "H??y ch???n ph?????ng x??!";
    }
    if (data.district === "") {
      isValidate = false;
      err["district"] = "H??y ch???n qu???n huy???n!";
    }
    if (data.province === "") {
      isValidate = false;
      err["province"] = "H??y ch???n t???nh th??nh!";
    }

    setError(err);
    return isValidate;
  };
  //Show list errors
  const errorArr = Object.keys(error).map((k, i) => (
    <li key={i}>{error[k]}</li>
  ));

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (validateForm()) {
        setLoading(true);
        const url = "http://localhost:8000/api/auth/register-user";
        const res = await axios.post(url, data);
        if (res.data.success) {
          setLoading(false);
          Swal.fire({
            title: "Ho??n th??nh",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "??i t???i x??c th???c t??i kho???n",
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
      }
    }
  };

  return (
    <div className="rUser">
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
      <div className="rUContainer">
        <Link to="/home" style={{ color: "inherit", textDecoration: "none" }}>
          <div className="rULogo">TutorSite</div>
        </Link>
        <h2 className="rUTitle">????ng k?? t??i kho???n cho ph??? huynh h???c sinh</h2>
        <form className="rUForm">
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
                  value={data.username}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="birthday">Ng??y sinh</label>
                <input
                  type="date"
                  id="birthday"
                  className="form-control"
                  value={data.birthday}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password">M???t kh???u</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Nh???p m???t kh???u"
                  value={data.password}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirm_password">Nh???p l???i m???t kh???u</label>
                <input
                  type="password"
                  id="confirm_password"
                  className="form-control"
                  placeholder="Nh???p l???i m???t kh???u"
                  value={data.confirm_password}
                  required
                  onChange={handleChange}
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
                  value={data.email}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone_number">S??? ??i???n tho???i</label>
                <input
                  type="text"
                  id="phone_number"
                  className="form-control"
                  placeholder="0834759xxx"
                  value={data.phone_number}
                  onChange={handleChange}
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
                <label htmlFor="CCCD">S??? CCCD</label>
                <input
                  type="text"
                  id="CCCD"
                  className="form-control"
                  placeholder="0834759xxx"
                  value={data.CCCD}
                  required
                  onChange={handleChange}
                />
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
                      value={data.home_number}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="street">T??n ???????ng</label>
                    <input
                      type="text"
                      id="street"
                      className="form-control"
                      placeholder="???????ng 3/2"
                      value={data.street}
                      onChange={handleChange}
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
            <hr />
          </div>

          <button className="fButton" type="submit" onClick={handleSubmit}>
            ????ng k??
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register_user;

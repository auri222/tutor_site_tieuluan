import "./editProfile.css";
import { useContext, useState, useEffect } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const EditProfile = () => {
  const styleCustom = {
    minHeight: "calc(100vh - 80px - 163.6px)",
  };
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [account, setAccount] = useState([]);
  const [data, setData] = useState({
    username: "",
    birthday: new Date(),
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
  const navigate = useNavigate();
  const [error, setError] = useState({});

  // Fetch province data
  useEffect(() => {
    const loadAccount = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/account/${user?._id}`,
          { withCredentials: true }
        );
        if (res.data) {
          setAccount(res.data);
        }
      } catch (error) {
        console.log(error.data);
      }
    };
    loadAccount();

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
  }, [user]);

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

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      username: account.username || "",
      birthday: handleDate(account.birthday) || "",
      email: account.email || "",
      phone_number: account.phone_number || "",
      CCCD: account.CCCD || "",
      home_number: account?.address?.home_number || "",
      street: account?.address?.street || "",
      province: account?.address?.province,
      district: account?.address?.district,
      ward: account?.address?.ward,
    }));
  }, [account]);

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

  const handleChange = (event) =>
    setData({ ...data, [event.target.id]: event.target.value });

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
    }
    if (data.email === "") {
      isValidate = false;
      err["email"] = "H??y nh???p ?????a ch??? email!";
    }
    if (
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
        // setLoading(true);
        const url = `http://localhost:8000/api/account/edit/${user._id}`;
        const res = await axios.put(url, data, { withCredentials: true });
        if (res.data.success) {
          Swal.fire({
            title: "Ho??n th??nh",
            text: `${res.data.message}`,
            icon: "success",
            confirmButtonText: "Xong",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate(`/profile/${user._id}`);
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

  const handleDate = (date) => {
    let d = new Date(date);
    let d1 = d.getDate();
    let m1 = d.getMonth() + 1;
    let y1 = d.getFullYear();

    return `${y1}-${m1 < 10 ? "0" + m1 : m1}-${d1 < 10 ? "0" + d1 : d1}`;
  };

  return (
    <>
      <Navbar />
      <section className="profileContainer" style={styleCustom}>
        <div className="container">
          <div className="pAWrapper">
            <h2 className="pAEditTitle">S???a th??ng tin t??i kho???n</h2>
            {id === user?._id ? (
              <form className="pAEditForm">
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
                        value={data?.username || ""}
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
                        value={handleDate(data?.birthday)}
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
                        value={data?.email || ""}
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
                        value={data?.phone_number || ""}
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
                        value={data?.CCCD || ""}
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
                            value={data?.home_number || ""}
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
                            value={data?.street || ""}
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
                            defaultValue={"DEFAULT"}
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
                      <small>
                        Kh??ng c???n ch???n t???nh th??nh, qu???n huy???n, ph?????ng x?? n???u
                        kh??ng b???n mu???n s???a
                      </small>
                    </div>

                    <div className="mb-3">
                      {Object.keys(error).length !== 0 ? (
                        <div className="mb-3">
                          <div
                            className="alert alert-warning mb-3"
                            role="alert"
                          >
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

                <button
                  className="fButton"
                  type="submit"
                  onClick={handleSubmit}
                >
                  S???a th??ng tin
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

export default EditProfile;

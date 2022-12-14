import "./tutorsList.css";
import { useState, useEffect, useContext } from "react";
import Navbar from "../../../components/navbar/Navbar";
import Footer from "../../../components/footer/Footer";
import SearchTutorItem from "../../../components/searchTutorItem/SearchTutorItem";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ScrollTop from "../../../components/scrollTop/ScrollTop";

const TutorsList = () => {
  const navigate = useNavigate();

  //Check user
  const { user } = useContext(AuthContext);

  //Search data
  const [tutorName, setTutorName] = useState("");
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
  });

  // Load initial
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [subjects, setSubjects] = useState([]); //load
  const [classes, setClasses] = useState([]); //Load data classes
  const [provinces, setProvinces] = useState([]); //load
  const [districts, setDistricts] = useState([]); //load
  const [wards, setWards] = useState([]); //load

  useEffect(() => {
    const fetchTutorList = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/tutors/");
        if (res.data) {
          setTotal(res.data.total);
          setList(res.data.tutorsList);
        }
      } catch (error) {
        console.log(error.data);
      }
    };

    fetchTutorList();

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

    fetchClass();
    fetchSubject();
  }, []);

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

  const handleProvinceChange = (e) => {
    setAddress({
      ...address,
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text.replace(
        /[\s]/g,
        "%20"
      ),
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
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text.replace(
        /[\s]/g,
        "%20"
      ),
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
      [e.target.id]: e.nativeEvent.target[e.target.selectedIndex].text.replace(
        /[\s]/g,
        "%20"
      ),
    });
  };

  const handleSearch = async () => {
    try {
      let stringClass = "";
      selectedClasses?.forEach((item, index) => {
        stringClass += (index === selectedClasses.length-1) ? `${item}`: `${item},`;
      })

      let stringSubject = "";
      selectedSubjects?.forEach((item, index) => {
        stringSubject += (index === selectedSubjects.length-1)? `${item}`: `${item},`;
      })

      let name = "";
      if(tutorName !== ""){
        name = tutorName.replace(/[\s]/g, "%20");
      }

      console.log(stringClass);
      console.log(stringSubject);
      const url = `http://localhost:8000/api/tutors?tutor_name=${name}&classes=${stringClass}&subjects=${stringSubject}&province=${address.province}&district=${address.district}&ward=${address.ward}`;
      const res = await axios.get(url);
      if(res.data){
        setTotal(res.data.total);
        setList(res.data.tutorsList);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleClickRegister = (id, name) => {
    if(user === null){
      Swal.fire({
        title: 'B???n c???n ????ng nh???p ????? ????ng k??!',
        text: "H??y ????ng nh???p ho???c t???o t??i kho???n!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#01c75d',
        confirmButtonText: '????ng nh???p ngay',
        cancelButtonText: '????ng'
      }).then((result) => {
        if (result.isConfirmed) {
          // console.log("Login agree!");
          navigate('/login');
        }
      })
    }
    else if(user?.accountType === 'USER'){
      navigate(`/tutors/register_tutor/${id}`, {state: {tutor: name}});
    }
    else{
      Swal.fire({
        icon: "warning",
        title: "C???nh b??o",
        text: "????ng k?? gia s?? ch??? cho t??i kho???n th??ng th?????ng!",
      });
    }
  }

  const handleClickDetails = (id) => {
    navigate(`/profile/${id}`);
  }

  return (
    <>
      <Navbar />
      <ScrollTop />
      <section className="tlSearch py-4">
        <div className="container">
          <div className="tlSearchOptionsContainer">
            <h4 className="tlSOTitle">T??m ki???m gia s??</h4>
            <hr />
            <div className="tlSOItems my-3">
              {/* Search tutor name */}
              <div className="row mt-3">
                <div className="col-md-3">
                  <h4 className="tlSearchPartTitle">H??? t??n gia s??</h4>
                </div>
                <div className="col-md-9">
                  <input
                    type="text"
                    id="tutor_name"
                    className="form-control"
                    value={tutorName}
                    placeholder="Nh???p t??n gia s?? ????? t??m ki???m..."
                    onChange={(e) => setTutorName(e.target.value)}
                  />
                </div>
              </div>
              {/* Search address */}
              <div className="row mt-3">
                <div className="col-md-3">
                  <h4 className="tlSearchPartTitle">Khu v???c</h4>
                </div>
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <select
                        id="province"
                        defaultValue={"default"}
                        className="form-control"
                        onChange={handleProvinceChange}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Ch???n t???nh th??nh"
                      >
                        <option
                          disabled
                          value="default"
                          className="text-center"
                        >
                          --Ch???n t???nh th??nh --
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
                    <div className="col-md-4 mb-3">
                      <select
                        id="district"
                        defaultValue={"default"}
                        className="form-control"
                        onChange={handleDistrictChange}
                      >
                        <option
                          disabled
                          value="default"
                          className="text-center"
                        >
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
                    <div className="col-md-4 mb-3">
                      <select
                        id="ward"
                        defaultValue={"default"}
                        className="form-control"
                        onChange={handleWardChange}
                      >
                        <option
                          disabled
                          value="default"
                          className="text-center"
                        >
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
              {/* Search classes */}
              <div className="row mt-3">
                <div className="col-md-3">
                  <h4 className="tlSearchPartTitle">L???p</h4>
                </div>
                <div className="col-md-9">
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
                            value={item.code}
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
              {/* Search subjects */}
              <div className="row my-3">
                <div className="col-md-3">
                  <h4 className="tlSearchPartTitle">M??n</h4>
                </div>
                <div className="col-md-9">
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
                            value={item.code}
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
              <div className="row mt-3">
                <div className="col-md-9"></div>
                <div className="col-12 col-md-3">
                  <button className="searchButton" onClick={handleSearch}>T??m ki???m</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tlSearchResult pb-4">
        <div className="container">
          <div className="tlSRContainer">
            <div className="tlSRTitleContainer">
              <h4 className="tlSRTitle">K???t qu??? t??m ki???m</h4>
              <h4 className="tlSRTitleTotal">T???ng c???ng: {total ? total : 0}</h4>
            </div>
            <hr />
            <div className="row mt-3">
              {list ? (
                list.map((item, index) => (
                  <div className="col-md-12" key={index}>
                    <SearchTutorItem item={item} handleClickRegister={handleClickRegister} onClick={handleClickDetails}/>
                  </div>
                ))
              ) : (
                <div className="col-md-12">
                  <span className="tlSRText">Kh??ng t??m th???y</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default TutorsList;

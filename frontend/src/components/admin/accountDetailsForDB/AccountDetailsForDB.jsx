import "./accountDetailsForDB.css";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import ProfileAchievement from "../../profileAchievement/ProfileAchievement";
import CourseItem from "../../courseItem/CourseItem";
import React from "react";
import { useParams } from "react-router-dom";


const AccountDetailsForDB = () => {
  const { id } = useParams();
  const [accountInfo, setAccountInfo] = useState([]);
  const [tutorInfo, setTutorInfo] = useState([]);
  const [tutorAchievement, setTutorAchievement] = useState([]);
  const [coursePHHS, setCoursePHHS] = useState([]);
  const [courseRegisteredTutor, setCourseRegisteredTutor] = useState([]);
  const [courseUnregisteredTutor, setCourseUnregisteredTutor] = useState([]);

  useEffect(() => {
    const loadAccountInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/account/${id}`, {
          withCredentials: true,
        });
        if (res.data) {
          setAccountInfo(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const loadTutorInfo = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/tutors/${id}`, {
          withCredentials: true,
        });
        if (res.data) {
          setTutorInfo(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const loadTutorAchievementInfo = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/tutor_achievement/achievements/${id}`,
          { withCredentials: true }
        );
        if (res.data) {
          setTutorAchievement(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const loadCourseOfPHHS = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/course/user/${id}`,
          { withCredentials: true }
        );
        if (res.data) {
          setCoursePHHS(res.data.courses);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const loadRegisteredCoursesOfTutor = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/course/tutor/registered/${id}`,
          { withCredentials: true }
        );
        if (res.data) {
          setCourseRegisteredTutor(res.data.courses);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const loadUnregisteredCoursesOfTutor = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/course/tutor/unregistered/${id}`,
          { withCredentials: true }
        );
        if (res.data) {
          setCourseUnregisteredTutor(res.data.courses);
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadAccountInfo();
    loadTutorInfo();
    loadTutorAchievementInfo();
    loadCourseOfPHHS();
    loadRegisteredCoursesOfTutor();
    loadUnregisteredCoursesOfTutor();
  }, [id]);

  const handleDate = (date) => {
    let d = new Date(date);
    let result = `${d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()}/${
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    }/${d.getFullYear()} `;
    return result;
  };

  const handleCreatedDate = (date) => {
    let d = new Date(date);
    return `${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:${
      d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()
    }:${d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds()} ${
      d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()
    }/${
      d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    }/${d.getFullYear()}`;
  };
  // useEffect(() => {
  //   console.log(accountInfo);
  //   console.log(tutorInfo);
  //   console.log(tutorAchievement);
  // }, [accountInfo, tutorAchievement, tutorInfo]);

  return (
    <div className="accDetails">
      <div className="accountDetailsTitle">Th??ng tin t??i kho???n</div>
      <div className="accountDetailsWrapper">
        <div className="row mx-0">
          <div className="col-md-9 accountWrapper">
            <h2 className="accDetailsTtitle">T??i kho???n</h2>
            <table className="table table-borderless table-responsive">
              <tbody>
                {accountInfo && (
                  <>
                    <tr>
                      <th scope="row">T??n ????ng nh???p</th>
                      <td>{accountInfo?.username}</td>
                    </tr>
                    <tr>
                      <th scope="row">Ng??y sinh</th>
                      <td>{handleDate(accountInfo?.birthday)}</td>
                    </tr>
                    <tr>
                      <th scope="row">?????a ch???</th>
                      <td>{`${accountInfo?.address?.home_number}, ${accountInfo?.address?.street}, ${accountInfo?.address?.ward}, ${accountInfo?.address?.district}, ${accountInfo?.address?.province}`}</td>
                    </tr>
                    <tr>
                      <th scope="row">Email</th>
                      <td>{accountInfo.email}</td>
                    </tr>
                    <tr>
                      <th scope="row">S??? ??i???n tho???i</th>
                      <td>{accountInfo.phone_number}</td>
                    </tr>
                    <tr>
                      <th scope="row">S??? CCCD</th>
                      <td>{accountInfo.CCCD}</td>
                    </tr>
                    <tr>
                      <th scope="row">Lo???i t??i kho???n</th>
                      <td>
                        {accountInfo.accountType === "USER"
                          ? "Ph??? huynh h???c sinh"
                          : accountInfo.accountType === "TUTOR"
                          ? "Gia s??"
                          : "Admin"}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Ng??y t???o</th>
                      <td>{handleCreatedDate(accountInfo?.createdAt)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {tutorInfo && Object.keys(tutorInfo).length > 0 && (
          <div className="row mx-0 mt-3">
            <div className="col-md-9 accountWrapper ">
              <h2 className="accDetailsTtitle">Th??ng tin gia s??</h2>
              <table className="table table-borderless table-responsive">
                <tbody>
                  <>
                    <tr>
                      <td colSpan={2}>
                        <img
                          src={tutorInfo?.tutor_profile_image}
                          className="rounded mx-auto d-block pTImg"
                          alt={`H??nh gia s?? ${tutorInfo?.tutor_name}`}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">H??? t??n gia s??</th>
                      <td>{tutorInfo?.tutor_name}</td>
                    </tr>
                    <tr>
                      <th scope="row">Ch???c danh</th>
                      <td>{tutorInfo?.tutor_title}</td>
                    </tr>
                    <tr>
                      <th scope="row">Ngh??? nghi???p</th>
                      <td>{tutorInfo?.tutor_occupation}</td>
                    </tr>
                    <tr>
                      <th scope="row">N??i l??m vi???c</th>
                      <td>{tutorInfo?.tutor_workplace_name}</td>
                    </tr>
                    <tr>
                      <th scope="row">?????a ch??? n??i l??m vi???c</th>
                      <td>{tutorInfo?.tutor_workplace_address}</td>
                    </tr>
                    <tr>
                      <th scope="row">L???p gi???ng d???y</th>
                      <td>
                        {tutorInfo?.tutor_classes
                          ? tutorInfo?.tutor_classes.map((item, index) => (
                              <span key={index}>
                                {index === tutorInfo?.tutor_classes.length - 1
                                  ? `${item}`
                                  : `${item}, `}
                              </span>
                            ))
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">M??n gi???ng d???y</th>
                      <td>
                        {tutorInfo?.tutor_subjects
                          ? tutorInfo?.tutor_subjects.map((item, index) => (
                              <span key={index}>
                                {index === tutorInfo?.tutor_subjects.length - 1
                                  ? `${item}`
                                  : `${item}, `}
                              </span>
                            ))
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">L???ch gi???ng d???y</th>
                      <td>
                        {tutorInfo?.tutor_schedule
                          ? tutorInfo?.tutor_schedule.map((item, index) => (
                              <span key={index}>
                                {index === tutorInfo?.tutor_schedule.length - 1
                                  ? `${item}`
                                  : `${item}, `}
                              </span>
                            ))
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Ng??y th??m</th>
                      <td>{handleCreatedDate(tutorInfo?.createdAt)}</td>
                    </tr>
                    <tr>
                      <th scope="row">Ng??y c???p nh???t</th>
                      <td>{handleCreatedDate(tutorInfo?.UpdatedAt)}</td>
                    </tr>
                    <tr>
                      <th scope="row">???nh CCCD</th>
                      <td>
                        {tutorInfo?.tutor_CCCD_image
                          ? tutorInfo?.tutor_CCCD_image.map((item, index) => (
                              <img
                                key={index}
                                src={item}
                                className="rounded pTCCCDImg img-fluid"
                                alt={`H??nh CCCD c???a gia s?? ${tutorInfo?.tutor_name}`}
                              />
                            ))
                          : "Kh??ng c?? ???nh"}
                      </td>
                    </tr>
                  </>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tutorAchievement && tutorAchievement.length !== 0 && (
          <div className="row mx-0 mt-3">
            <div className="col-md-9 accountWrapper ">
              <h2 className="accDetailsTtitle">
                Th??nh t??ch (b???ng c???p) c???a gia s??
              </h2>
              {tutorAchievement &&
                tutorAchievement.map((item) => (
                  <ProfileAchievement show={0} info={item} key={item._id} />
                ))}
            </div>
          </div>
        )}

        {coursePHHS && coursePHHS.length !== 0 && (
          <div className="row mx-0 mt-3">
            <div className="col-md-9 accountWrapper ">
              <h2 className="accDetailsTtitle">
                C??c kh??a h???c c???a ph??? huynh h???c sinh {accountInfo?.username}
              </h2>
              {coursePHHS &&
                coursePHHS.map((item) => (
                  <CourseItem item={item} key={item._id} />
                ))}
            </div>
          </div>
        )}

        {courseRegisteredTutor && courseRegisteredTutor.length !== 0 && (
          <div className="row mx-0 mt-3">
          <div className="col-md-9 accountWrapper ">
            <h2 className="accDetailsTtitle">
              C??c kh??a h???c ???? ???????c ch???n (?????ng ??) c???a gia s?? {tutorInfo?.tutor_name}
            </h2>
            {courseRegisteredTutor &&
              courseRegisteredTutor.map((item) => (
                <CourseItem item={item} key={item._id} />
              ))}
          </div>
        </div>
        )}

        {courseUnregisteredTutor && courseUnregisteredTutor.length !== 0 && (
          <div className="row mx-0 mt-3">
          <div className="col-md-9 accountWrapper ">
            <h2 className="accDetailsTtitle">
              C??c kh??a h???c ch??a ???????c ch???n c???a gia s?? {tutorInfo?.tutor_name}
            </h2>
            {courseUnregisteredTutor &&
              courseUnregisteredTutor.map((item) => (
                <CourseItem item={item} key={item._id} />
              ))}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AccountDetailsForDB;

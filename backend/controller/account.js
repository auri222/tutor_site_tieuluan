const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const { createOTP } = require("../ultilities/createOTP");
const { sendMail } = require("../ultilities/sendMail");
const { createError } = require("../ultilities/createError");
const Course = require("../models/Course");
const TutorAchievement = require("../models/TutorAchievement");
const Notification = require("../models/Notification");
const Comment = require("../models/Comment");
const Contact = require("../models/Contact");
const Tutor = require("../models/Tutor");
const { getPublicId } = require("../ultilities/cloudinaryUltils");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const getUsersList = async (req, res, next) => {
  try {
    const list = await Account.find({}, { OTP: 0, token: 0, password: 0 });
    const total = await Account.count();

    res.status(200).json({ total, list });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  const { username, skip, limit } = req.query;
  try {
    const total = await Account.count();
    let query = {};
    let isLoadMore = false;
    // console.log(skip);
    // console.log(limit);
    // console.log(username);

    if (
      username &&
      username !== '""' &&
      username !== `''` &&
      username !== undefined &&
      username !== null
    ) {
      query["username"] = new RegExp(username, "i");
    }
    console.log(query);
    const total_rows_query = await Account.count(query);

    let loadRecord = parseInt(skip) + parseInt(limit);
    if (loadRecord < total_rows_query) {
      isLoadMore = true;
    }

    if (total_rows_query < loadRecord) {
      isLoadMore = false;
    }
    console.log(`Total query: ${total_rows_query}`);
    console.log(`Skip: ${skip}`);
    console.log(`Limit: ${limit}`);
    console.log(`LoadRecord: ${loadRecord}`);
    console.log(`isloadmore: ${isLoadMore}`);

    const list = await Account.find(query, { OTP: 0, token: 0, password: 0 })
      .skip(skip)
      .limit(limit);

    res
      .status(200)
      .json({ total, list, skip: parseInt(skip), isLoadMore: isLoadMore });
  } catch (error) {
    next(error);
  }
};

const countUsers = async (req, res, next) => {
  try {
    const total = await Account.count({ accountType: "USER" });

    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

const countTutors = async (req, res, next) => {
  try {
    const total = await Account.count({ accountType: "TUTOR" });

    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

const countContacts = async (req, res, next) => {
  try {
    const total = await Contact.count();

    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

const countAdmins = async (req, res, next) => {
  try {
    const total = await Account.count({ accountType: "ADMIN" });

    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

const countCourse = async (req, res, next) => {
  try {
    const total = await Course.count();

    res.status(200).json(total);
  } catch (error) {
    next(error);
  }
};

const editPassword = async (req, res, next) => {
  const accountID = req.params.id;
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    //check account
    const accountInfo = await Account.findById(accountID);

    if (!accountInfo) return next(createError(400, "T??i kho???n kh??ng t???n t???i!"));

    if (!oldPassword) return next(createError(400, "Nh???p m???t kh???u c??!"));

    if (!newPassword) return next(createError(400, "Nh???p m???t kh???u m???i!"));

    const passwordValid = await bcrypt.compareSync(
      oldPassword,
      accountInfo.password
    );

    if (!passwordValid)
      return next(createError(400, "M???t kh???u c?? kh??ng ????ng!"));

    if (newPassword !== confirmPassword)
      return next(
        createError(400, "M???t kh???u m???i v?? x??c nh???n m???t kh???u ph???i kh???p nhau!")
      );

    if (!newPassword.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([\W]*).{8,}/))
      return next(
        createError(
          400,
          "M???t kh???u m???i ph???i d??i h??n 8 k?? t???; ph???i g???m s???, ch??? in hoa, in th?????ng, k?? t??? ?????c bi???t (@*#$%!&)"
        )
      );

    //Check ok
    const salt = bcrypt.genSaltSync(10);

    // Hash password
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    await Account.findByIdAndUpdate(
      accountID,
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Thay m???t kh???u th??nh c??ng!" });
  } catch (error) {
    next(error);
  }
};

const editAccountInfo = async (req, res, next) => {
  const accountID = req.params.id;
  const {
    username,
    birthday,
    CCCD,
    home_number,
    street,
    ward,
    district,
    province,
    email,
    phone_number,
  } = req.body;
  try {
    //If change => have to login again
    let checkUsername = false;

    //check account
    const accountInfo = await Account.findById(accountID);

    if (!accountInfo) return next(createError(400, "T??i kho???n kh??ng t???n t???i!"));

    if (
      username === "" ||
      birthday === "" ||
      CCCD === "" ||
      home_number === "" ||
      street === "" ||
      ward === "" ||
      district === "" ||
      province === "" ||
      email === "" ||
      phone_number === ""
    )
      return next(createError(400, "H??y nh???p ?????y ????? th??ng tin!"));

    let errorMsg = "";
    if (phone_number.length > 10) errorMsg += "H??y nh???p s??? ??i???n tho???i h???p l???! ";

    if (CCCD.length !== 12) errorMsg += "H??y nh???p s??? CCCD h???p l???! ";

    if (
      !email.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      )
    )
      errorMsg += "H??y nh???p email h???p l???! ";

    if (errorMsg.length > 0) return next(createError(400, errorMsg));

    if (accountInfo.username !== username) checkUsername = true;
    else {
      checkUsername = false;
    }

    let newProvince =
      province === "DEFAULT" ? accountInfo.address.province : province;
    let newDistrict =
      district === "DEFAULT" ? accountInfo.address.district : district;
    let newWard = ward === "DEFAULT" ? accountInfo.address.ward : ward;

    //OK
    await Account.findByIdAndUpdate(
      accountID,
      {
        $set: {
          username: username,
          birthday: birthday,
          CCCD: CCCD,
          "address.home_number": home_number,
          "address.street": street,
          "address.ward": newWard,
          "address.district": newDistrict,
          "address.province": newProvince,
          email: email,
          phone_number: phone_number,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "S???a th??ng tin t??i kho???n th??nh c??ng!",
      checkUsername: checkUsername,
    });
  } catch (error) {
    next(error);
  }
};

const getAccount = async (req, res, next) => {
  const accountID = req.params.id;
  try {
    //Check account
    const account = await Account.findById(accountID, {
      password: 0,
      isVerify: 0,
      isLock: 0,
      isAdmin: 0,
      OTP: 0,
      token: 0,
    });
    if (!account) return next(createError(400, "T??i kho???n kh??ng t???n t???i!"));

    //OK
    res.status(200).json(account);
  } catch (error) {
    next(error);
  }
};

const lockAccount = async (req, res, next) => {
  const accountID = req.params.id;
  try {
    const account = await Account.findById(accountID);

    if (!account) return next(createError(404, "T??i kho???n kh??ng t???n t???i"));

    await Account.findByIdAndUpdate(accountID, { $set: { isLock: true } });

    res
      .status(200)
      .json({ success: true, message: "Kh??a t??i kho???n th??nh c??ng!" });
  } catch (error) {
    next(error);
  }
};

const lockAccountByUser = async (req, res, next) => {
  const accountID = req.params.id;
  try {
    const account = await Account.findById(accountID);

    if (!account) return next(createError(404, "T??i kho???n kh??ng t???n t???i"));

    await Account.findByIdAndUpdate(accountID, { $set: { isLock: true } });

    const content =  `Ng?????i d??ng ${account.username} ???? y??u c???u x??a t??i kho???n c???a h???.`;

     // _id of Account Admin => if system have many admin account then loop through and send to all 
    const newContact = new Contact({
      content: content,
      sender: account.username,
      isCheck: false,
      createdAt: new Date()
    });

    const newNotification = new Notification({
      receiver: '638e4c36ec0debf428f7f6c0', 
      sender: account.username,
      type: 'SYSTEM',
      message: content,
      isRead: false,
      typeID: null
    });

    await newContact.save();
    await newNotification.save();

    res
      .status(200)
      .json({ success: true, message: "Y??u c???u x??a ???? ???????c g???i th??nh c??ng! Ch??ng t??i s??? x??a t??i kho???n trong kho???n th???i gian g???n nh???t! Trong kho???ng th???i gian ?????i x??a, ch??ng t??i s??? kh??a t??i kho???n c???a b???n!" });

  } catch (error) {
    next(error);
  }
};
const unlockAccount = async (req, res, next) => {
  const accountID = req.params.id;
  try {
    const account = await Account.findById(accountID);

    if (!account) return next(createError(404, "T??i kho???n kh??ng t???n t???i"));

    await Account.findByIdAndUpdate(accountID, { $set: { isLock: false } });

    res
      .status(200)
      .json({ success: true, message: "Kh??a t??i kho???n th??nh c??ng!" });
  } catch (error) {
    next(error);
  }
};

const accountStat = async (req, res, next) => {
  const accountID = req.params.id;
  try {
    const account = await Account.findById(accountID);

    if (!account) return next(createError(404, "T??i kho???n kh??ng t???n t???i"));

    let totalCourse = 0;

    //USER
    if (account.accountType === "USER") {
      totalCourse = await Course.count({ account: accountID });
    }

    //TUTOR
    if (account.accountType === "TUTOR") {
      totalCourse = await Course.count({
        "course_registered_tutor.registered_tutor": accountID,
      });
    }

    res.status(200).json(totalCourse);
  } catch (error) {
    next(error);
  }
};

const deleteAccount = async (req, res, next) => {
  const accountID = req.params.id;
  try {
    //Check account
    const account = await Account.findById(accountID);

    if (!account) return next(createError(404, "T??i kho???n kh??ng t???n t???i!"));

    //Check Account Type
    //TUTOR
    if (account.accountType === "TUTOR") {
      const tutorCoursePrivate1 = await Course.find({
        course_purpose: 2,
        course_status: 1,
        "course_registered_tutor.registered_tutor": accountID
      });

      if(tutorCoursePrivate1.length > 0){
        for(let course of tutorCoursePrivate1){
          let tutorInfo = await Tutor.findOne({ account: accountID });
          //Send notification to PHHS
          const message = `Kh??a h???c ${course.course_name} (${course.course_code}) ???? b??? x??a v?? t??i kho???n c???a gia s?? ${tutorInfo?.tutor_name} ???? b??? x??a. B???n s??? kh??ng th??? truy c???p v??o kh??a h???c n??y.`;
          const type = "SYSTEM";
          const isRead = false;
          const newNotification = new Notification({
            receiver: course.account,
            type: type,
            message: message,
            isRead: isRead,
          });

          await newNotification.save();
          await Course.findByIdAndDelete(course._id);
        }
      }

      const tutor = await Tutor.findOne({account: accountID});

      //Delete tutor_achievement
      const achievements = await TutorAchievement.find({tutor: tutor._id});
      if(achievements.length > 0){
        for(let achievement of achievements){
          //Delete image on cloud
          let publicID = getPublicId(achievement.achievement_image);
          await cloudinary.uploader.destroy(publicID).then((response) => console.log(response)).catch((err) => console.log(err));

          //Delete achievement
          await TutorAchievement.findByIdAndDelete(achievement._id);
        }
      }

      //Delete tutor profile
      //  - Delete image on cloud
      if(tutor.tutor_CCCD_image.length >0){
        for(let cccd of tutor.tutor_CCCD_image){
          let publicID = getPublicId(cccd);
          await cloudinary.uploader.destroy(publicID).then((response) => console.log(response)).catch((err) => console.log(err));
        }
      }
      
      if(tutor.tutor_profile_image){
        let publicID = getPublicId(tutor.tutor_profile_image);
        await cloudinary.uploader.destroy(publicID).then((response) => console.log(response)).catch((err) => console.log(err));
      }
      //  - Delete tutor profile
      let resultTutor = await Tutor.findByIdAndDelete(tutor._id);

      //Delete comment on this account
      let resultComment = await Comment.deleteMany({tutor: accountID});

      //Send email 
      const text = `
      <p>TutorSite xin th??ng b??o,</p>
      <p>T??i kho???n c???a b???n ???? b??? x??a tr??n h??? th???ng.</p>
      <p>C???m ??n b???n v?? ???? g???n b?? v???i ch??ng t??i trong su???t th???i gian qua.</p>
      `;
      const subject = "Th??ng b??o x??a t??i kho???n";

      await sendMail(account.email, subject, text);

      //Delete Notification of this account
      let resultNotification = await Notification.deleteMany({receiver: accountID});



      //Delete Account
      let resultAccount = await Account.findByIdAndDelete(accountID);

      console.log(`Tutor : ${resultTutor}`);
      console.log(`Comment : ${resultComment}`);
      console.log(`Notifications : ${resultNotification}`);
      console.log(`Account : ${resultAccount}`);

      res.status(200).json({success: true, message: "X??a t??i kho???n th??nh c??ng!"});
    }

    //PHHS - USER
    if (account.accountType === "USER") {
      //1. Check list courses:
      //    - course private AND status = 2 => DELETE
      //    - course private AND status = 1 => DELETE & notify TUTOR
      //    - course public AND status 0 => DELETE & check CANDIDATES ->notify them
      //    - course public AND status 2 => DELETE
      const coursePrivate1 = await Course.find({
        course_purpose: 2,
        course_status: 1,
        account: accountID,
      });
      const coursePrivate2 = await Course.find({
        course_purpose: 2,
        course_status: 2,
        account: accountID,
      });
      const coursePublic0 = await Course.find({
        course_purpose: 1,
        course_status: 0,
        account: accountID,
      });
      const coursePublic2 = await Course.find({
        course_purpose: 1,
        course_status: 2,
        account: accountID,
      });

      //Delete courses with purpose = 2, status = 1 => Notify Chosen Tutor
      if (coursePrivate1.length > 0) {
        for (let course of coursePrivate1) {
          let tutorID = course.course_registered_tutor.registered_tutor;
          //Send notification to Tutor
          const message = `Kh??a h???c ${course.course_name} (${course.course_code}) ???? b??? x??a. B???n s??? kh??ng th??? truy c???p v??o kh??a h???c n??y.`;
          const type = "SYSTEM";
          const isRead = false;
          const newNotification = new Notification({
            receiver: tutorID,
            type: type,
            message: message,
            isRead: isRead,
          });

          await newNotification.save();
          await Course.findByIdAndDelete(course._id);
        }
      }

      //Delete courses public purpose=1, status=0 => notify candidates
      if (coursePublic0.length > 0) {
        for (let course of coursePublic0) {
          //Notify candidates
          if (course.course_candidates !== 0) {
            for (let candidate of course.course_candidates) {
              //Send notification
              let message = `Kh??a h???c ${course.course_name} (M?? ${course.course_code}) ???? b??? x??a. B???n s??? kh??ng th??? truy c???p v??o kh??a h???c.`;
              let notifiyCandidates = new Notification({
                receiver: candidate,
                type: "SYSTEM",
                message: message,
                isRead: false,
              });
              await notifiyCandidates.save();
            }
          }

          await Course.findByIdAndDelete(course._id);
        }
      }

      //Delete course with status =2 => Don't need to notify
      let resultDeleteCoursePrivate2 = {};
      let resultDeleteCoursePublic2 = {};
      if (coursePrivate2.length > 0) {
        resultDeleteCoursePrivate2 = await Course.deleteMany({
          account: accountID,
          course_purpose: 2,
          course_status: 2,
        });
      }

      if (coursePublic2.length > 0) {
        resultDeleteCoursePublic2 = await Course.deleteMany({
          account: accountID,
          course_purpose: 2,
          course_status: 2,
        });
      }

      //Delete notifications of this account user
      let resultNotification = await Notification.deleteMany({receiver: accountID});

      //Send email 
      const text = `
      <p>TutorSite xin th??ng b??o,</p>
      <p>T??i kho???n c???a b???n ???? b??? x??a tr??n h??? th???ng.</p>
      <p>C???m ??n b???n v?? ???? g???n b?? v???i ch??ng t??i trong su???t th???i gian qua.</p>
      `;
      const subject = "Th??ng b??o x??a t??i kho???n";

      await sendMail(account.email, subject, text);

      //Delete account
      let resultAccount = await Account.findByIdAndDelete(accountID);

      console.log(`Course Public 2: ${resultDeleteCoursePublic2}`);
      console.log(`Course Private 2 : ${resultDeleteCoursePrivate2}`);
      console.log(`Notifications : ${resultNotification}`);
      console.log(`Account : ${resultAccount}`);
      res
        .status(200)
        .json({ success: true, message: "???? x??a t??i kho???n th??nh c??ng!" });

      //2. Delete notification:
      //3. Delete account:
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsersList,
  countUsers,
  countAdmins,
  countTutors,
  editPassword,
  editAccountInfo,
  getAccount,
  countCourse,
  countContacts,
  getAllUsers,
  lockAccount,
  deleteAccount,
  unlockAccount,
  accountStat,
  lockAccountByUser
};

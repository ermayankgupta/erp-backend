var cron = require("node-cron");
const AttendenceModal = require("../modal/AttendenceModal");
const EmployeeModal = require("../modal/EmployeeModal");
const moment = require("moment");
exports.clockIn = async (req, res) => {
  try {
    const employee = req.employee._id;
    const existingAttendence = await AttendenceModal.findOne({
      employee,
      date: new Date().toDateString(),
    });

    if (existingAttendence) {
      throw new Error("You already clockin for today");
    } else {
      const attendence = new AttendenceModal({
        employee,
        date: new Date().toDateString(),
        clockIn: new Date(),
      });

      await attendence.save();

      res
        .status(201)
        .json({ message: "Employee clock in Successfully", attendence });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clockOut = async (req, res) => {
  try {
    const employee = req.employee._id;
    const attendence = await AttendenceModal.findOne({
      employee,
      date: new Date().toDateString(),
    });

    if (!attendence) {
      throw new Error("You haven't clock In for today");
    }
    if (attendence?.clockOut) {
      throw new Error("You already clock Out for today");
    }
    attendence.clockOut = new Date();

    await attendence.save();
    res
      .status(201)
      .json({ message: "Employee clock Out Successfully", attendence });
  } catch (err) {
    if (!res.headerSent) {
      res.status(500).json({ error: err.message });
    }
  }
};

exports.attendenceStatus = async (req, res) => {
  try {
    const employee = req.employee._id;
    const clockedIn = await AttendenceModal.findOne({
      employee,
      date: new Date().toDateString(),
    });

    const totalWorkHoursInMonth = await AttendenceModal.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $match: {
          employee: req.employee._id,
        },
      },
      {
        $group: {
          _id: null,
          totalWorkHours: { $sum: "$totalWorkHours" },
        },
      },
    ]);
    const totalOvertimeInMonth = await AttendenceModal.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      },
      {
        $match: {
          employee: req.employee._id,
        },
      },
      {
        $group: {
          _id: null,
          overtime: { $sum: "$overtime" },
        },
      },
    ]);
    const totalWorkHoursInWeek = await AttendenceModal.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate() - new Date().getDay()
            ),
          },
        },
      },
      {
        $match: {
          employee: req.employee._id,
        },
      },
      {
        $group: {
          _id: null,
          totalWorkHours: { $sum: "$totalWorkHours" },
        },
      },
    ]);
    console.log(totalWorkHoursInMonth);
    if (clockedIn?.clockOut) {
      return res.status(200).send({
        data: clockedIn,
        workInMonth: totalWorkHoursInMonth[0].totalWorkHours,
        workInWeek: totalWorkHoursInWeek[0].totalWorkHours,
        overtimeInMonth: totalOvertimeInMonth[0].overtime,
        message: "Employee clockout already",
        clockin: true,
        clockout: true,
      });
    }
    if (clockedIn) {
      return res.status(200).send({
        data: clockedIn,
        workInMonth: totalWorkHoursInMonth[0].totalWorkHours,
        workInWeek: totalWorkHoursInWeek[0].totalWorkHours,
        overtimeInMonth: totalOvertimeInMonth[0].overtime,
        message: "Employee clocked In already",
        clockin: true,
        clockout: false,
      });
    } else {
      res.status(200).send({
        data: clockedIn,
        workInMonth: totalWorkHoursInMonth[0].totalWorkHours,
        workInWeek: totalWorkHoursInWeek[0].totalWorkHours,
        overtimeInMonth: totalOvertimeInMonth[0].overtime,
        message: "Employee not clocked In",
        clockin: false,
        clockout: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAttendence = async (req, res) => {
  try {
    const attendences = await AttendenceModal.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$date" }, parseInt(req.query.month)],
          },
        },
      },
      {
        $match: {
          $expr: {
            $eq: [{ $year: "$date" }, parseInt(req.query.year)],
          },
        },
      },
      {
        $match: {
          employee: req.employee._id,
        },
      },
    ]);
    res.status(200).send(attendences);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editAttendence = async (req, res) => {
  try {
    console.log(req.query.id);
    const update = await AttendenceModal.findByIdAndUpdate(
      req.query.id,
      {
        editClockIn: moment(req.body.editClockIn, "HH:mm").toDate(),
        editClockOut: moment(req.body.editClockOut, "HH:mm").toDate(),
        editReason: req.body.editReason,
        editStatus: req.body.editStatus,
      },
      { new: true }
    );
    res.status(201).send(update);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.attendencerequest = async (req, res) => {
  try {
    const attendenceChangeRequest = await AttendenceModal.find({
      editStatus: { $in: ["Pending", "Rejected", "Approved"] },
    }).populate("employee");
    res.status(200).send(attendenceChangeRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAttendenceRequest = async (req, res) => {
  try {
    const updateRequest = await AttendenceModal.findByIdAndUpdate(
      req.query.id,
      { editStatus: req.query.status },
      { new: true }
    );
    res.status(201).json({updateRequest,message:"Request change Successfully"})
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const weeklyOffRecord = async () => {
  if (new Date().getDay() === 0 || new Date().getDay() === 6) {
    try {
      const employees = await EmployeeModal.find();
      for (const employee of employees) {
        const existingRecord = await AttendenceModal.findOne({
          date: new Date(),
          employee: employee._id,
        });
        if (!existingRecord) {
          const attedence = new AttendenceModal({
            employee: employee._id,
            date: new Date(),
            status: "Weekly Off",
          });
          await attedence.save();
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};

// Run the createWeeklyOffAttendance function every day at 12:00 AM
cron.schedule("0 0 * * *", () => {
  weeklyOffRecord();
});

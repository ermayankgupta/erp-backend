const HolidayModal = require("../modal/HolidayModal");

exports.addHoliday = async (req, res) => {
  try {
    const existingRecord = await HolidayModal.findOne({ date: req.body.date });
    if (existingRecord) {
      throw new Error("Holiday already created");
    } else {
      const holiday = new HolidayModal(req.body);
      await holiday.save();
      res.status(201).send(holiday);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHolidays = async (req, res) => {
  try {
    const holidays = await HolidayModal.find();
    res.status(200).send(holidays);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

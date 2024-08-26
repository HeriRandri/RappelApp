const { User, Rappel } = require("../model/listModel");

module.exports.getTask = async (req, res) => {
  try {
    const { isId } = req.params;
    if (!isId) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = await User.findById(isId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur no trouve" });
    }

    const task = await Rappel.find({ userId: user._id });
    if (task.length === 0) {
      return res.status(404).json({ message: "No data Found" });
    }
    res.json(task);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.deleteTask = async (req, res) => {
  const { idDel } = req.params;
  const { isId } = req.params;
  if (!isId) {
    return res.status(400).json({ message: "User not found" });
  }

  const user = await User.findById(isId);

  if (!user) {
    return res.status(404).json({ message: "Utilisateur no trouve" });
  }

  const tasksDelete = await Rappel.findByIdAndDelete({
    _id: idDel,
    userId: user._id,
  });
  if (!tasksDelete) {
    return res.status(404).json({ msg: `No task with id': ${idDel}` });
  }
  res.status(200).json({ task });
  res.json(tasksDelete);
};

const express = require("express");
const Message = require("../models/Message");
const httpStatus = require("../http/httpStatus");
const router = express.Router();

//GET all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({
      createdAt: -1,
    });
    if (!messages) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Messages not found !" });
    }
    res.status(httpStatus.OK).json(messages);
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Erreur lors de la récupération des messages" });
  }
});

// GET one message
router.get("/:id", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Message not found" });
    }
    res.status(httpStatus.OK).json(message);
  } catch (err) {
    //res.status(500).json({ error: err.message });
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Erreur lors de la récupération d'un message" });
  }
});

// POST new message
router.post("/", async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(httpStatus.CREATED).json(message);
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Erreur lors de l'enregistrement d'un message" });
  }
});

// PUT update message
router.put("/:id", async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!message) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Message not found" });
    }
    res.status(httpStatus.OK).json(message);
  } catch (err) {
    console.error(err); // pour déboguer dans la console
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Erreur lors de la mise à jour d'un message" });
  }
});

// DELETE message
router.delete("/:id", async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: "Message not found" });
    }
    res.status(httpStatus.OK).json({ success: true });
  } catch (err) {
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Erreur lors de la suppression d'un message" });
  }
});

module.exports = router;

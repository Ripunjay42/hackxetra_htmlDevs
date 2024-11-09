const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { verifyUser, verifyAdmin } = require("../authMiddleware");

router.post('/group/create', verifyUser, groupController.createGroup);

router.put("/group/:groupId/update", verifyUser, verifyAdmin, groupController.updateGroupDetails);

router.delete("/group/:groupId/delete", verifyUser, verifyAdmin, groupController.deleteGroup);

router.get('/:groupId/details', groupController.getDetailsOfGroup);

router.get("/:groupId/users", groupController.getAllUsers);

router.get("/:groupId/admins", groupController.getAllAdmins);

router.post('/group/:groupId/user/add', verifyUser, groupController.addGroupMember);

router.post('/group/:groupId/admin/add', verifyUser, verifyAdmin, groupController.addNewAdmin);

router.delete("/group/:groupId/member/:userId/remove", verifyUser, verifyAdmin, groupController.removeGroupMember);

module.exports = router;

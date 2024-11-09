const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');
const { verifyUser, verifyAdmin } = require("../authMiddleware");


router.post('/club/create', verifyUser, clubController.createClub);

router.put("/club/:clubId/update", verifyUser, verifyAdmin,clubController.updateClubDetails);



//not fixed
router.delete("/club/:clubId/delete", verifyUser, verifyAdmin,clubController.deleteClub)


router.get('/:clubId/details',clubController.getDetailsofClub);

router.get("/:clubId/users",clubController.getAllUsers);

router.get("/:clubId/admins",clubController.getAllAdmins);

router.post('/club/:clubId/user/add', verifyUser,clubController.addClubMember);

router.post('/club/:clubId/admin/add',verifyUser, verifyAdmin,clubController.addNewAdmin);

router.delete("/club/:clubId/member/:userId/remove",verifyUser,verifyAdmin,clubController.removeClubMember);

module.exports = router;
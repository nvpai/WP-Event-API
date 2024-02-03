// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import {Router} from 'express';
const router = Router();
import {aData, eData} from '../data/index.js';
import help from '../helpers.js';
router
  .route('/:eventId')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.eventId = help.checkId(req.params.eventId,'Event Id');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      let eventAttendee = await aData.getAllAttendees(req.params.eventId);
      return res.json(eventAttendee);
    } catch (e) {
      return res.status(404).json({error: e});
    }

  })
  .post(async (req, res) => {
    //code here for POST
    let data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }

    try {
      req.params.eventId = help.checkId(req.params.eventId,'Event Id');
      data.firstName = help.checkString(data.firstName,'First Name');
      data.lastName = help.checkString(data.lastName,'Last Name');
      data.emailAddress=help.checkString(data.emailAddress, 'Email Address');
      help.emailCheck(data.emailAddress);
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try{
      await eData.get(req.params.eventId);
    }catch(e){
      return res.status(404).json({error: e});
    }

    try {
      const addAttendee = await aData.createAttendee(
        req.params.eventId,
        data.firstName,
        data.lastName,
        data.emailAddress);
      return res.json(addAttendee);
    } catch (e) {
      return res.status(400).json({error: e});
    }    
  });

router
  .route('/attendee/:attendeeId')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.attendeeId = help.checkId(req.params.attendeeId,'Attendee ID');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      let eventAttendee = await aData.getAttendee(req.params.attendeeId);
      return res.json(eventAttendee);
    } catch (e) {
      return res.status(404).json({error: e});
    }
    
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
      req.params.attendeeId = help.checkId(req.params.attendeeId,'Attendee ID');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try{
      await aData.getAttendee(req.params.attendeeId);
    }catch(e){
      return res.status(404).json({error: e});
    }
    try{
      const deleteA = await aData.removeAttendee(req.params.attendeeId)
      return res.json(deleteA)
    }catch(e){
      return res.status(500).json({error: e});
    }
  });
export default router;
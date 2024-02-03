// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import {Router} from 'express';
const router = Router();
import {eData} from '../data/index.js';
import help from '../helpers.js';

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      let eventList = await eData.getAll();
      return res.json(eventList);
    } catch (e) {
      return res.status(500).json({error: e});
    }
  })
  .post(async (req, res) => {
    //code here for POST
    let userInfo = req.body;
    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }

    try {
      help.createUpdate(userInfo.eventName,userInfo.description,userInfo.eventLocation,
        userInfo.contactEmail,userInfo.maxCapacity,userInfo.priceOfAdmission, userInfo.eventDate, 
        userInfo.startTime, userInfo.endTime, userInfo.publicEvent)
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      let {eventName, description, eventLocation, contactEmail, maxCapacity, priceOfAdmission, eventDate, startTime, endTime, publicEvent} = userInfo;   
      eventName=eventName.trim();
      description=description.trim();
      eventLocation.streetAddress=eventLocation.streetAddress.trim();
      eventLocation.city= eventLocation.city.trim();
      eventLocation.state=eventLocation.state.trim();
      eventLocation.zip=eventLocation.zip.trim();
      contactEmail=contactEmail.trim();
      eventDate=eventDate.trim();
      startTime=startTime.trim();
      endTime=endTime.trim();
      
      const newEvent = await eData.create(eventName,description,eventLocation,contactEmail,maxCapacity,priceOfAdmission,eventDate,startTime,endTime,publicEvent);
      return res.json(newEvent);
    } catch (e) {
      return res.status(500).json({error: e});
    }    
  });

router
  .route('/:eventId')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.eventId = help.checkId(req.params.eventId,'Event ID');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      let event = await eData.get(req.params.eventId);
      return res.json(event);
    } catch (e) {
      return res.status(404).json({error: e});
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
      req.params.eventId = help.checkId(req.params.eventId,'Event ID');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try{
      await eData.get(req.params.eventId);
    }catch(e){
      return res.status(404).json({error: e});
    }
    try{
      const deleteEvent = await eData.remove(req.params.eventId)
      return res.json(deleteEvent)
    }catch(e){
      return res.status(500).json({error: e});
    }


  })
  .put(async (req, res) => {
    //code here for PUT
    let updateData = req.body;
    if (!updateData || Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    try {
      req.params.eventId = help.checkId(req.params.eventId,'Event ID');
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try{
      await eData.get(req.params.eventId);
    }catch(e){
      return res.status(404).json({error: e});
    }
    try {
      help.createUpdate(updateData.eventName,updateData.description,updateData.eventLocation,
        updateData.contactEmail,updateData.maxCapacity,updateData.priceOfAdmission, updateData.eventDate, 
        updateData.startTime, updateData.endTime, updateData.publicEvent)
    } catch (e) {
      return res.status(400).json({error: e});
    }

    try {
      let {eventName, description, eventLocation, contactEmail, maxCapacity, priceOfAdmission, eventDate, startTime, endTime, publicEvent} = updateData;   
      eventName=eventName.trim();
      description=description.trim();
      contactEmail=contactEmail.trim();
      eventDate=eventDate.trim();
      startTime=startTime.trim();
      endTime=endTime.trim();
      
      const updateEvent = await eData.update(req.params.eventId,eventName,description,eventLocation,contactEmail,maxCapacity,priceOfAdmission,eventDate,startTime,endTime,publicEvent);
      return res.json(updateEvent);
    } catch (e) {
      return res.status(500).json({error: e});
    }    

  });

export default router;
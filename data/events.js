// This data file should export all functions using the ES6 standard as shown in the lecture code
import {events} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import help from '../helpers.js'

export const create = async (
  eventName,
  description,
  eventLocation,
  contactEmail,
  maxCapacity,
  priceOfAdmission,
  eventDate,
  startTime,
  endTime,
  publicEvent
) => {
  //Implement Code here
  help.createUpdate(eventName,
    description,
    eventLocation,
    contactEmail,
    maxCapacity,
    priceOfAdmission,
    eventDate,
    startTime,
    endTime,
    publicEvent);
    

    eventName = eventName.trim();
    description=description.trim();
    contactEmail=contactEmail.trim();
    eventLocation.streetAddress=eventLocation.streetAddress.trim();
    eventLocation.city= eventLocation.city.trim();
    eventLocation.state=eventLocation.state.trim();
    eventLocation.zip=eventLocation.zip.trim();
    eventDate=eventDate.trim();
    startTime=startTime.trim();
    endTime=endTime.trim();
    
  //Database operation
  
  let newEvent ={
    eventName: eventName,
    description: description,
    eventLocation: eventLocation,
    contactEmail: contactEmail,
    maxCapacity: maxCapacity,
    priceOfAdmission: priceOfAdmission, 
    eventDate: eventDate, 
    startTime: startTime, 
    endTime: endTime, 
    publicEvent: publicEvent,
    attendees: [],
    totalNumberOfAttendees: 0

  };

  const eventCollection = await events();
  const insertInfo = await eventCollection.insertOne(newEvent);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not create event';

  const newId = insertInfo.insertedId.toString();
  const event = await eventCollection.findOne({_id: new ObjectId(newId)});
  if (event === null) throw 'No event with that id';
  event._id = event._id.toString();

  return event

};

export const getAll = async () => {
  //Implement Code here
  const eventCollection = await events();
  let eventList = await eventCollection.find({}).project({_id:1, eventName:1}).toArray();
  if (!eventList) 
    throw 'Could not get all events';

  eventList = eventList.map((element) => {
      element._id = element._id.toString();
      return element;
  });
  return eventList;

};

export const get = async (eventId) => {
  //Implement Code here
  const id = help.checkId(eventId, 'Event ID');
  
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  
  const eventCollection = await events();
  const event = await eventCollection.findOne({_id: new ObjectId(id)});
  if (event === null) throw `No event with that id: ${id}`;
  event._id = event._id.toString();
  return event;
};

export const remove = async (eventId) => {
  //Implement Code here
  const id= help.checkId(eventId, 'Event ID');
  
  if(!ObjectId.isValid(id)) throw "Id is invalid";

  const eventCollection = await events();
  const eventDeleteInfo = await eventCollection.findOneAndDelete({_id: new ObjectId(id)});
  if(!eventDeleteInfo){
    throw `Could not delete event of provided id: ${id}`
  }
  let deletedObj = {eventName: eventDeleteInfo.eventName, deleted: true}
  return deletedObj;
};

export const update = async (
  eventId,
  eventName,
  eventDescription,
  eventLocation,
  contactEmail,
  maxCapacity,
  priceOfAdmission,
  eventDate,
  startTime,
  endTime,
  publicEvent
) => {
  //Implement Code here
  help.createUpdate(eventName,
    eventDescription,
    eventLocation,
    contactEmail,
    maxCapacity,
    priceOfAdmission,
    eventDate,
    startTime,
    endTime,
    publicEvent);
    

    eventName = eventName.trim();
    eventDescription=eventDescription.trim();
    contactEmail=contactEmail.trim();
    eventLocation.streetAddress=eventLocation.streetAddress.trim();
    eventLocation.city= eventLocation.city.trim();
    eventLocation.state=eventLocation.state.trim();
    eventLocation.zip=eventLocation.zip.trim();
    eventDate=eventDate.trim();
    startTime=startTime.trim();
    endTime=endTime.trim();

    const id = help.checkId(eventId, 'Event Id');
    
    let getEvent = await get (id)
    let arrayA = getEvent.attendees
    
    let total = getEvent.totalNumberOfAttendees
    

    let updateData = {
      _id: new ObjectId(id),
      eventName: eventName,
      description: eventDescription,
      eventLocation: eventLocation,
      contactEmail: contactEmail,
      maxCapacity: maxCapacity,
      priceOfAdmission: priceOfAdmission, 
      eventDate: eventDate, 
      startTime: startTime, 
      endTime: endTime, 
      publicEvent: publicEvent,
      attendees: arrayA,
      totalNumberOfAttendees: total

    };
    const eventCollection = await events();
    const updateInfo = await eventCollection.findOneAndUpdate(
      {_id:new ObjectId(id)},
      {$set: updateData},
      {returnDocument: 'after'}
    );
    if (!updateInfo)
      throw `Error: Update failed! Could not update post with id ${id}`;
    
    return updateInfo;


};




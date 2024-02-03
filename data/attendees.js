// This data file should export all functions using the ES6 standard as shown in the lecture code
import {events} from '../config/mongoCollections.js';
import {ObjectId} from 'mongodb';
import help from '../helpers.js';
import * as eventsData from './events.js';

export const createAttendee = async (eventId,firstName, lastName, emailAddress) => {
  //Implement Code here
  eventId = help.checkId(eventId, 'Event Id');
  firstName=help.checkString(firstName, 'First Name');
  lastName=help.checkString(lastName,'Last Name');
  emailAddress=help.checkString(emailAddress,'Email');

  const mailStr =/^[a-zA-Z0-9]+[._-]?[a-zA-Z0-9]+@{1}[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
  if(!emailAddress.match(mailStr)){
    throw "Invalid Email"
  }
  const eventCollection = await events();
  const data = await eventCollection.findOne({_id:new ObjectId(eventId)});
  if (data === null) throw 'No event with that id';
  
  if(data.attendees.length === data.maxCapacity){
    throw "Max capacity reached, cannot add more attendees"
  }
  const checkEmail = data.attendees.find((val) => {
    if (val.emailAddress.toUpperCase() === emailAddress.toUpperCase()){
      return true;
    }
  });
  if(checkEmail){
    throw "Email Address already in attendees "
  }
  let attendeeObj ={
    _id: new ObjectId(),
    firstName: firstName,
    lastName: lastName,
    emailAddress: emailAddress   
  }

  
  data.attendees.push(attendeeObj);
  data.totalNumberOfAttendees=data.attendees.length;
  
  
  const newAttendee = await eventCollection.updateOne(
    {_id:new ObjectId(eventId)},
    {$set: data},
    {returnDocument: 'after'}
  );
  if (!newAttendee)
    throw `Error: Update failed! Could not add attendee`;

  return await eventsData.get(eventId)
  


};

export const getAllAttendees = async (eventId) => {
  //Implement Code here
  eventId = help.checkId(eventId, 'EventId');
  const eventCollection = await events();
  const data = await eventCollection.findOne({_id:new ObjectId(eventId)});
  if (data === null) throw 'No event with that id';

  return data.attendees

};

export const getAttendee = async (attendeeId) => {
  //Implement Code here
  attendeeId=help.checkId(attendeeId, 'Attendee ID');
  const eventCollection = await events();
  
  const data = await eventCollection.findOne(
    {'attendees._id':new ObjectId(attendeeId)},
    {projection:{_id:0,'attendees.$':1}}
  );
  if(!data){
    throw `No attendee present of the given id:${attendeeId}`
  }
  
  return data.attendees[0]
};

export const removeAttendee = async (attendeeId) => {
  //Implement Code here
  attendeeId=help.checkId(attendeeId,'Attendee Id');
  const eventCollection = await events();
  
  const getA = await getAttendee(attendeeId);
  
  const eventId= await eventCollection.findOne(
    {'attendees._id':new ObjectId(attendeeId)},
    {projection:{_id:1}}
  );
  if(!eventId){
    throw "Attendee Id does not have an event id"
  }
  const data = await eventCollection.updateOne(
    {'attendees._id':new ObjectId(attendeeId)},
    {$pull: {attendees: {_id: new ObjectId(attendeeId)}},
    $inc: {totalNumberOfAttendees: -1}}
  );
  const id = eventId._id
  const idStr = id.toString();
  
  if(data.modifiedCount ===0){
    throw `Could not remove the attendee of id ${attendeeId}`
  }
  
  return await eventsData.get(idStr)
  
};

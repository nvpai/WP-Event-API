// You can add and export any helper functions you want here - if you aren't using any, then you can just leave this file as is
import {ObjectId} from 'mongodb';
import isLeapYear from 'leap-year'
const exportedMethods = {
  checkId(id, varName='id') {
    if (!id) throw `Error: You must provide an ${varName} to search for`;
    if (typeof id !== 'string') throw `Error: ${varName} must be a string`;
    id = id.trim();
    if (id.length === 0)
      throw `Error: ${varName} cannot be an empty string or just spaces`;
    if (!ObjectId.isValid(id)) throw 'Error: invalid object ID';
    return id;
  },

  checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  },
  emailCheck(emailAddress){
    const mailStr =/^[a-zA-Z0-9]+[._-]?[a-zA-Z0-9]+@{1}[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
    if(!emailAddress.match(mailStr)){
      throw "Invalid Email"
    }
  },

  createUpdate(eventName,
    eventDescription,
    eventLocation,
    contactEmail,
    maxCapacity,
    priceOfAdmission,
    eventDate,
    startTime,
    endTime,
    publicEvent){
    if(!eventName || !eventDescription || !eventLocation || !contactEmail || !maxCapacity || 
        !eventDate || !startTime || !endTime){
        throw "Provide valid input"
      }
      const input = [eventName, eventDescription, contactEmail, eventDate, startTime, endTime]
      for (let x of input){
        if(typeof(x) != 'string'){
          throw `Input value ${x} should be string`
        }
        x = x.trim()
        if(x.length === 0){
          throw `Strings with only spaces are not valid`
        }
      }
      eventName = eventName.trim()
      if(eventName.length < 5){
        throw "Event Name cannnot be less than 5 char"
      }
      eventDescription=eventDescription.trim()
      if(eventDescription.length < 25){
        throw "Event Description cannnot be less than 25 char"
      }
      
      contactEmail = contactEmail.trim()
      const mailStr =/^[a-zA-Z0-9]+[._-]?[a-zA-Z0-9]+@{1}[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/
      if(!contactEmail.match(mailStr)){
        throw "Invalid Email"
      }
      eventDate =eventDate.trim()
      const dateCheck = new Date(eventDate)
      if(isNaN(dateCheck)){
        throw "Invalid  Date"
        
      }
      const dateStr = eventDate.split('/')
      const mon = dateStr[0]
      const date = dateStr[1]
      const year = dateStr[2]
      
      if(mon.length != 2 || date.length != 2 || year.length != 4){
        throw `Enter eventDate: ${eventDate} in "MM/DD/YYYY" format.`
      }
    
      if(!(mon>= 1 && mon<=12))
        throw "Month value is not valid, enter value between 1-12"
      const day31 = ['01', '03', '05', '07', '08', '10', '12']
      const day30 =['04', '06', '09', '11']
      if(day31.includes(mon)) {
        if(!(date>=1 && date<=31)){
          throw "Invalid date "
        }
      }
      if(day30.includes(mon)) {
        if(!(date>=1 && date<=30)){
          throw "Invalid input, day should be between 1-30 "
        }
      }
      if(mon == '02'){
        if(isLeapYear(year)){
          if(!(date>=1 && date<=29)){
            throw "Leap year feb should have date in between 1-29"
          }
        }
        else{
          if (!(date>=1 && date<=28)){
            throw "Feb should have date in between 1-28"
          }
        }
        
      }
      const currentDate = new Date()
      if(dateCheck < currentDate){
        throw "Event date should be greater than current date."
      }
      
      startTime = startTime.trim()
      endTime=endTime.trim()
      
      const timeStr = /^(1[012]|\d):([0-5]\d)\s(AM|PM)$/
      if(!startTime.match(timeStr) || !endTime.match(timeStr)){
        throw "Start or End time not in correct format"
      }
      let st = startTime.match(timeStr)
      //const sTime = `${st[1]}:${st[2]}`
      let et = endTime.match(timeStr)
     // const eTime =`${et[1]}:${et[2]}`
    
      const sObjDate = new Date()
      let sh;
      if(st[3] === 'PM'){
        sh = parseInt(st[1]) + 12
      }
      else{
        sh = parseInt(st[1])
      }
      sObjDate.setHours(sh,parseInt(st[2]))
    
      const eObjDate = new Date()
      let eh;
      if(et[3] === 'PM'){
        eh = parseInt(et[1]) + 12
      }
      else{
        eh = parseInt(et[1])
      }
      eObjDate.setHours(eh,parseInt(et[2]))
    
      if(sObjDate>=eObjDate){
        throw "start time cannnot be later than end time"
      }
      if ((eObjDate-sObjDate)/(60000) < 30) {
        throw "endTime should be at least 30 minutes later than the startTime"
      }
      if(typeof(publicEvent) != 'boolean'){
        throw "Public event should be of type boolean"
      }
      if(typeof(maxCapacity) != 'number' || typeof(priceOfAdmission) != 'number'){
        throw "maxCapacity and priceOfAdmission should be numbers"
      }
      if(!(maxCapacity > 0) || !Number.isFinite(maxCapacity)){
        throw "maxCapacity should be positive number"
      }
      if(! Number.isInteger(maxCapacity)){
        throw "maxCapacity should be integer"
      }
      if(!Number.isFinite(priceOfAdmission)){
        throw "priceOfAdmission is not finite"
      }
    
      if(!(priceOfAdmission >=0)|| priceOfAdmission < 0 ){
        throw "priceofAdmission not valid input"
      }
      const decimal = priceOfAdmission.toString().split(".")
      
      if(decimal[1]){
        if(decimal[1].length != 2){
          throw "price can be a whole number or a two decimal place float"
        }
      }
    
      //Event Location Check
      if(typeof(eventLocation) != 'object'){
        throw "Event location should be object"
      }
      if(Object.keys(eventLocation).length != 4){
        throw "Event Location should have 4 values"
      }
      if(!eventLocation.streetAddress ||!eventLocation.city ||!eventLocation.state || !eventLocation.zip ){
        throw "Event Location is missing Street address or city or state or zip"
      }
      const eventL = [eventLocation.streetAddress,eventLocation.city,eventLocation.state,eventLocation.zip]
      for (let x of eventL){
        
        if(typeof(x) != 'string'){
          throw `Input value ${x} should be string`
        }
        x = x.trim()
        if(x.length === 0){
          throw `Strings with only spaces are not valid`
        }
      }
      eventLocation.streetAddress = eventLocation.streetAddress.trim()
      if(eventLocation.streetAddress.length < 3){
        throw "Street Address should not be less than 3 char"
      }
      eventLocation.city=eventLocation.city.trim()
      if(eventLocation.city.length <3){
        throw"City should not be less than 3 char"
      }
      const stateCode = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];
      
      eventLocation.state=eventLocation.state.trim().toUpperCase()
      if(!eventLocation.state.length === 2){
        throw "State should be 2 char"
      }
      if(!stateCode.includes(eventLocation.state)){
        throw "State not valid"
      }
      eventLocation.zip=eventLocation.zip.trim()
      const zipStr = /^\d\d\d\d\d$/
      if(!eventLocation.zip.match(zipStr)){
        throw "zip should contain 5 numbers"
      }
    
  }
};

export default exportedMethods;
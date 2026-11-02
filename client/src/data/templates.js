const R=(name,x,y,w,l,kind)=>({name,x,y,w,l,kind});
export const TEMPLATES={
'2BHK':{label:'2BHK · 900 sq ft',plot:[30,30],cfg:{floors:1,bedrooms:2,bathrooms:2,garage:false,garden:true,pool:false},floorArea:900,rooms:[
R('Master bedroom',0,0,12,13,'bed'),R('Bath 1',12,0,6,8,'wet'),R('Passage',12,8,6,5,'common'),R('Bedroom 2',18,0,12,13,'bed'),R('Living room',0,13,15,17,'common'),R('Dining',15,13,8,9,'common'),R('Kitchen',23,13,7,9,'wet'),R('Entry',15,22,8,8,'common'),R('Bath 2',23,22,7,8,'wet')]},
'3BHK':{label:'3BHK · 1,200 sq ft',plot:[40,30],cfg:{floors:1,bedrooms:3,bathrooms:2,garage:true,garden:true,pool:false},floorArea:1200,rooms:[
R('Master bedroom',0,0,13,13,'bed'),R('Bath 1',13,0,7,8,'wet'),R('Passage',13,8,7,5,'common'),R('Bedroom 2',20,0,10,13,'bed'),R('Bedroom 3',30,0,10,13,'bed'),R('Living room',0,13,16,17,'common'),R('Dining',16,13,9,10,'common'),R('Kitchen',25,13,15,10,'wet'),R('Entry',16,23,9,7,'common'),R('Bath 2',25,23,7,7,'wet'),R('Utility',32,23,8,7,'common')]}};

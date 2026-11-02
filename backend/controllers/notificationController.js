import{Notification}from'../models/index.js';
export async function listNotifications(req,res){const[items,unreadCount]=await Promise.all([Notification.find({userId:req.user.id}).sort('-createdAt').limit(30),Notification.countDocuments({userId:req.user.id,read:false})]);res.json({items,unreadCount})}
export async function markNotificationRead(req,res){const n=await Notification.findOneAndUpdate({_id:req.params.id,userId:req.user.id},{read:true},{new:true});if(!n)return res.status(404).json({message:'Notification not found.'});res.json(n)}
export async function markAllNotificationsRead(req,res){await Notification.updateMany({userId:req.user.id,read:false},{read:true});res.json({message:'Notifications marked as read.'})}

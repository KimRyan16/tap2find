import express from 'express'
import { getStudentNotifications, addNotification, markAllNotificationsRead } from '../controllers/notificationController.js'

const router = express.Router()

router.get('/get-notification', getStudentNotifications)
router.post('/add-notification', addNotification)
router.post('/mark-all-read', markAllNotificationsRead)

export default router

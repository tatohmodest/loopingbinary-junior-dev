
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dztyw8ngu',
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || '515527988414963',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'Jp7tPaLOMAYTWoQ876SvJshheaU',
})

export default cloudinary

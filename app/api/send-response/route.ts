import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,  // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
})

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Only send email if credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: '💕 New Date Response!',
          html: `
            <h1>She responded!</h1>
            <p>Date: ${new Date(data.date).toLocaleDateString()}</p>
            <p>Time: ${data.time}</p>
            <p>Food: ${data.food.join(', ')}</p>
            <p>Movie: ${data.movie}</p>
            <p>Excitement: ${data.excitement}/100</p>
          `,
          attachments: [{
            filename: `date-response-${new Date().toISOString()}.json`,
            content: JSON.stringify(data, null, 2),
            contentType: 'application/json'
          }]
        })
        console.log('Email sent successfully')
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        // Don't fail the request if email fails
      }
    } else {
      console.log('Email credentials not configured - skipping email')
    }
    
    // Always return success - response is saved to localStorage on client
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Failed to process response:', error)
    // Return success anyway to not break the user experience
    return NextResponse.json({ success: true })
  }
}
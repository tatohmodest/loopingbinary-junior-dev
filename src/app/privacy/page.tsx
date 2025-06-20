// src/app/privacy/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to home
        </Link>
      </div>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">Last updated: June 17, 2025</p>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            At TeamHub, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, services, and applications (collectively, the "Services").
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
          </p>
          
          <h2>2. Information We Collect</h2>
          <p>
            We may collect information about you in various ways, including:
          </p>
          <h3>2.1 Information You Provide to Us</h3>
          <p>
            We collect information that you voluntarily provide to us when you:
          </p>
          <ul>
            <li>Register for an account</li>
            <li>Fill out forms on our website</li>
            <li>Participate in surveys or contests</li>
            <li>Contact our customer support</li>
            <li>Provide feedback or testimonials</li>
          </ul>
          <p>
            This information may include your name, email address, phone number, and any other information you choose to provide.
          </p>
          
          <h3>2.2 Information Automatically Collected</h3>
          <p>
            When you access or use our Services, we may automatically collect certain information, including:
          </p>
          <ul>
            <li>Device information (e.g., IP address, browser type, operating system)</li>
            <li>Usage information (e.g., pages visited, time spent on pages)</li>
            <li>Location information</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
          
          <h2>3. How We Use Your Information</h2>
          <p>
            We may use the information we collect for various purposes, including to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our Services</li>
            <li>Process transactions and manage your account</li>
            <li>Send you technical notices, updates, and administrative messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Communicate with you about products, services, offers, and events</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            <li>Personalize your experience</li>
          </ul>
          
          <h2>4. How We Share Your Information</h2>
          <p>
            We may share your information in the following circumstances:
          </p>
          <ul>
            <li>With service providers who perform services on our behalf</li>
            <li>To comply with legal obligations</li>
            <li>To protect and defend our rights and property</li>
            <li>With your consent or at your direction</li>
            <li>In connection with a business transfer (e.g., merger, acquisition)</li>
          </ul>
          
          <h2>5. Your Choices</h2>
          <p>
            You have certain choices regarding the information we collect and how it is used:
          </p>
          <ul>
            <li>Account Information: You can update your account information by logging into your account</li>
            <li>Cookies: You can set your browser to refuse all or some browser cookies</li>
            <li>Marketing Communications: You can opt out of receiving promotional emails from us</li>
          </ul>
          
          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your information against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
          
          <h2>7. Children's Privacy</h2>
          <p>
            Our Services are not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us.
          </p>
          
          <h2>8. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
          
          <h2>9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@teamhub.example.com.
          </p>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button asChild variant="outline">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

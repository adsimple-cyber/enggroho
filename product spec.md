# Product Specification: Enggroho Contact Form

## 1. Introduction
This document outlines the product specifications for the new "Contact Us" form on the Enggroho website. The goal is to provide users with a simple, secure, and accessible way to reach out for inquiries directly from the landing page.

## 2. Goals & Objectives
*   Allow visitors to send messages directly to the Enggroho administration team.
*   Improve user engagement and provide a clear call-to-action for prospective clients.
*   Ensure all submissions are spam-filtered and stored securely.

## 3. User Stories
*   **As a website visitor**, I want to find a contact form easily so that I can send an inquiry without opening my personal email client.
*   **As an administrator**, I want to receive email notifications when a new contact form is submitted so that I can respond promptly.
*   **As an administrator**, I want spam protection (e.g., reCAPTCHA) so that my inbox and database are not flooded with automated spam.

## 4. Functional Requirements
*   **Form Fields**:
    *   Full Name (Text input, Required)
    *   Email Address (Email input, Required)
    *   Company/Organization (Text input, Optional)
    *   Message (Textarea, Required)
*   **Validation**:
    *   Client-side validation (HTML5) to provide immediate feedback.
    *   Server-side validation to ensure data integrity before processing.
    *   Email format validation (e.g., must contain '@' and a valid domain).
*   **Spam Prevention**:
    *   Integration with Google reCAPTCHA v3 (invisible to user).
*   **Submission Handling**:
    *   Upon successful submission, display a positive success message or toast notification.
    *   Send an automated email notification to the admin team.
    *   (Optional) Send an automated "Thank you for reaching out" receipt to the user.

## 5. Non-Functional Requirements
*   **Performance**: The form submission API should respond within 2 seconds.
*   **Accessibility**: The form must be fully accessible (WCAG 2.1 AA compliant), including proper `<label>` tags, keyboard navigation, and screen reader support.
*   **Responsiveness**: The UI must adapt seamlessly across mobile, tablet, and desktop viewports.
*   **Security**: Implement rate limiting on the submission endpoint to prevent abuse.

## 6. Out of Scope
*   Live chat integration or chatbot functionalities.
*   A comprehensive ticketing system or customer support dashboard (to be handled in a future phase).

## 7. Metrics for Success
*   Number of valid form submissions per month.
*   Zero or near-zero spam submissions recorded in the database.
*   Positive feedback from the administration team regarding lead quality.

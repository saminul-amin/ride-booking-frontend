# Ride Booking System – Frontend

A **production-grade, responsive, and role-based frontend application** for a **Ride Booking Platform** (similar to Uber or Pathao), built with **React, Redux Toolkit, and RTK Query**.  

This project connects to the backend API and provides distinct user experiences for **Riders, Drivers, and Admins**, ensuring a consistent, polished, and intuitive UI/UX across all devices.

---

## Project Overview
This is the **frontend application** of the Ride Booking System. It includes:  
- Public landing pages  
- Role-based dashboards (Rider, Driver, Admin)  
- Authentication and authorization with JWT  
- Real-time ride booking workflows  
- Data visualization and interactive UI components

---

## Features

### 🔹 General
- Responsive UI (mobile, tablet, desktop)  
- Consistent theme with TailwindCSS and ShadCN
- Sticky navbar & themed footer  
- Lazy loading, skeleton loaders, and accessibility support

### 🔹 Authentication & Authorization
- JWT-based login & registration 
- Role selection during signup (`Rider` or `Driver`)
- Role-based landing dashboards
- Persistent login state
- Account status handling:  
  - Blocked/Suspended → redirected to status page  
  - Offline drivers → dashboard accessible, but no ride requests until online  

### 🔹 Rider Features
- Request rides (pickup, destination)  
- Ride history (pagination, filters, search)
- Ride details page (map, driver info, status timeline)  
- Profile management (name, email, role, phone)

### 🔹 Driver Features
- Online/Offline toggle  
- Accept/Reject ride requests  
- Active ride management (status updates)  
- Earnings dashboard (charts & breakdowns)  
- Ride history with filters  
- Profile management (vehicle info, contact, password)  

### 🔹 Admin Features
- Manage users (search, filter, block/unblock riders, approve/suspend drivers)  
- Ride oversight (filter by date, status, driver, rider)
- Profile management 

### 🔹 Error Handling & UX
- Proper validation & error messages in all forms  
- API/network failure handling with user-friendly messages  
- Toast/alert notifications (`sonner` from ShadCN)  
- Skeleton loaders and smooth transitions
- No broken links or inactive buttons

---

## Tech Stack
- **React** (with React Router)  
- **Redux Toolkit + RTK Query**  
- **TypeScript**  
- **Tailwind CSS**  
- **Axios**  

---

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/saminul-amin/ride-booking-frontend.git
   cd ride-booking-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**  
   Create a `.env.local` file in the root with:  
   ```
   VITE_API_URL=https://ride-booking-server.vercel.app/api/
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

---

## Error Handling
- All forms include validation (required fields, email format, password mismatch, etc.)  
- Custom error messages for API/network failures  
- Global error boundaries for handling unexpected crashes  
- Toasts for success/error feedback  

---

## Author

**Md. Saminul Amin**
- GitHub: [@Md. Saminul Amin](https://github.com/saminul-amin)
- Email: [saminul.amin@gmail.com](mailto:saminul.amin@gmail.com)
- LinkedIn: [Md. Saminul Amin](https://www.linkedin.com/in/md-saminul-amin-91605730a/)

---

## Live Link  
🔗 [Frontend Deployment Link](https://ride-booking-frontend-gamma.vercel.app/)  
🔗 [Backend Deployment Link](https://ride-booking-server.vercel.app/)

---

## Demo Video:

Check out the [walkthrough video](https://drive.google.com/file/d/11POckzIUsiS5DUhw9NYAdq1mrHu6FAjQ/view?usp=sharing)

---

⭐ **If you find this project helpful, please give it a star on GitHub!**
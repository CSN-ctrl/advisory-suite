## Booking System Plan

### 1. Database Tables (Supabase)
- **availability_slots**: Admin-configured available dates/times (date, start_time, end_time, duration_minutes, is_available)
- **bookings**: Client bookings (service_id, client_name, client_email, slot_date, slot_time, payment_type [deposit/full], amount_paid, status)

### 2. Admin Panel (`/admin/availability`)
- Simple calendar view where you click dates
- For each date: add/remove custom time slots (any duration/time)
- Toggle dates as available/unavailable
- View existing bookings
- Protected with a simple password (for now, no full auth)

### 3. Booking Flow (`/apply?service=...`)
- **Step 1 - Calendar**: Shows available dates (highlighted). Client picks date → sees available time slots
- **Step 2 - Personal Data**: Name, Email, Phone fields
- **Step 3 - Payment**: Choose deposit (%) or full payment → Stripe Checkout
- **Step 4 - Confirmation**: Success page after payment

### 4. Stripe Integration
- Stripe Checkout for both deposit and full payment
- Each service has its price from `services.ts`
- Deposit = configurable percentage (e.g., 30%)

### 5. Email Confirmation
- After successful payment: email to client AND to you
- Contains: service name, booked date/time, amount paid, payment type

### 6. UI Review
- Check all pages scale properly on mobile (393px viewport)
- Ensure consistent design across the booking flow

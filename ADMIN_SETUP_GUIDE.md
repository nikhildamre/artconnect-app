# 🔐 Admin Setup Guide for ArtVpp

## Current Issues Fixed

1. **Database Function Conflicts**: Fixed `has_role` function signature inconsistencies
2. **Missing Admin Access Control**: Added proper admin verification to dashboard
3. **Database Structure**: Ensured all required tables and policies exist
4. **Real Data Display**: Admin dashboard now shows actual data from database

## Steps to Complete Admin Setup

### Step 1: Run Simple Database Setup Script

1. Go to your Supabase project: https://supabase.com/dashboard/project/ekbeifreadpcmvolwfbi
2. Navigate to **SQL Editor** in the left sidebar
3. Copy and paste the contents of `simple-admin-setup.sql` (this avoids profile table conflicts)
4. Click **Run** to execute the script

### Step 2: Sign Up Admin User

1. If you haven't already, sign up with email: `artvppcoeteam@gmail.com`
2. Use any password you prefer
3. Verify the email if required

### Step 3: Re-run Database Script (if needed)

If the admin user didn't exist when you first ran the script:
1. Run the `simple-admin-setup.sql` script again
2. This will grant admin privileges to the email

### Step 4: Add Test Data (Optional)

To see both admin and vendor dashboards in action with sample data:
1. Copy and paste the contents of `add-test-data.sql` in Supabase SQL Editor
2. Click **Run** to create sample products, orders, and applications
3. This will help you test all admin and vendor features
4. The admin user will also get vendor role for testing the vendor dashboard

### Step 5: Test Admin and Vendor Access

1. Sign in with `artvppcoeteam@gmail.com`
2. Navigate to `/admin` in your app for admin dashboard
3. Navigate to `/vendor` in your app for vendor dashboard (since admin also has vendor role)
4. You should see both dashboards with real data

## What Both Dashboards Now Show

### Admin Dashboard (`/admin`)
- **Overview Tab**: Revenue, sellers, pending applications, pending artworks, recent orders
- **Applications Tab**: Review and approve/reject seller applications
- **Moderation Tab**: Approve/reject artwork submissions with feedback
- **Sellers Tab**: View all active vendors
- **Orders Tab**: Monitor all platform orders

### Vendor Dashboard (`/vendor`)
- **Overview Tab**: Personal revenue, products, orders, analytics charts
- **Products Tab**: Manage product catalog, view moderation status
- **Orders Tab**: Track orders containing vendor's products
- **Analytics Tab**: Business insights, performance metrics, conversion rates

## Seller Application Workflow

1. **User applies**: Via `/apply-seller` page
2. **Admin reviews**: In admin dashboard Applications tab
3. **Admin approves/rejects**: With optional feedback
4. **User gets vendor role**: Automatically granted on approval
5. **User can access vendor features**: Sell products, manage listings

## Mobile-First Design

Both admin and vendor dashboards are now fully responsive and optimized for mobile devices:
- Touch-friendly buttons and navigation
- Horizontal scrolling tabs
- Proper spacing and typography
- Mobile-optimized modals and forms
- Real-time data integration
- Smooth animations and transitions

## Security Features

- **Role-based access**: Only users with admin role can access dashboard
- **Audit logging**: All admin actions are logged
- **Row-level security**: Database policies enforce access control
- **Authentication required**: Must be signed in to access any admin features

## Troubleshooting

### If you get "column user_id does not exist" error:
1. Use `simple-admin-setup.sql` instead of the other scripts
2. This script avoids profile table conflicts and focuses on essential admin functionality
3. The admin dashboard will work without updating profile display names

### If admin access is denied:
1. Verify you're signed in with `artvppcoeteam@gmail.com`
2. Check if the database script ran successfully
3. Look for any error messages in browser console

### If data isn't showing:
1. Check browser network tab for API errors
2. Verify database tables exist and have data
3. Check Supabase logs for any RLS policy issues

### If seller applications aren't working:
1. Test the application flow as a regular user
2. Check if the seller_applications table exists
3. Verify RLS policies allow users to create applications

## Next Steps

After completing the setup:
1. Test the complete seller application workflow
2. Test both admin and vendor dashboards with real data
3. Create some test products to verify moderation flow
4. Test the order management system in both dashboards
5. Verify the revenue tracking and analytics features
6. Customize dashboards as needed

Both admin and vendor systems are now fully functional with proper mobile layout, real data integration, and complete workflows for managing the art marketplace platform!
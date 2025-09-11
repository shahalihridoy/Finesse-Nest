# Finesse E-commerce API - NestJS Version

This is a complete conversion of the original AdonisJS Finesse e-commerce application to NestJS with TypeScript and Drizzle ORM.

## 🚀 Features

- **Complete E-commerce Functionality**: Products, Orders, Cart, User Management
- **Authentication & Authorization**: JWT-based authentication with account activation
- **Product Management**: Main products, variations, stock management
- **Order Processing**: Order placement, payment processing, order tracking
- **Shopping Cart**: Add/remove items, quantity management
- **User Management**: Registration, login, profile management
- **Reviews & Ratings**: Product reviews and ratings system
- **Notifications**: User notifications system
- **File Upload**: Image upload for reviews and products
- **SMS Integration**: OTP and notification SMS (ready for integration)

## 🛠️ Technology Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **File Upload**: Multer
- **SMS**: Ready for SMS API integration

## 📁 Project Structure

```
src/
├── database/
│   ├── schema/           # Database schemas (Drizzle ORM)
│   ├── connection.ts     # Database connection
│   └── database.service.ts
├── modules/
│   ├── auth/            # Authentication module
│   ├── users/           # User management
│   ├── products/        # Product management
│   ├── orders/          # Order processing
│   ├── cart/            # Shopping cart
│   ├── home/            # Landing page data
│   ├── menu/            # Menu management
│   ├── shop/            # Shop functionality
│   ├── preorder/        # Pre-order system
│   ├── notifications/   # Notifications
│   └── upload/          # File upload
├── common/
│   └── services/        # Helper services
├── app.module.ts        # Main application module
└── main.ts             # Application entry point
```

## 🔧 Installation

1. **Install Dependencies**

   ```bash
   yarn install
   ```

2. **Environment Setup**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your database credentials and other configurations.

3. **Database Setup**

   ```bash
   # Generate migrations
   yarn db:generate

   # Run migrations
   yarn db:migrate
   ```

4. **Start Development Server**
   ```bash
   yarn start:dev
   ```

## 📋 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-activation-code` - Send OTP
- `POST /api/auth/activate-account` - Activate account
- `POST /api/auth/logout` - User logout

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/notifications` - Get notifications
- `GET /api/users/balance-details` - Get balance details

### Products

- `GET /api/products/details/:id` - Get product details
- `GET /api/products/variable/:id` - Get product variations
- `GET /api/products/related/:id` - Get related products
- `GET /api/products/reviews/:id` - Get product reviews
- `POST /api/products/reviews` - Add product review

### Cart

- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove from cart

### Orders

- `GET /api/orders` - Get user orders
- `POST /api/orders` - Place order
- `POST /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/:id/pay` - Process payment

### Home

- `GET /api/home/top-promotional-sliders` - Get promotional sliders
- `GET /api/home/front-sliders` - Get main sliders
- `GET /api/home/landing-products` - Get landing page products

## 🔄 Conversion Notes

### Maintained Original Logic

- ✅ All business logic preserved exactly as original
- ✅ Same validation rules and error handling
- ✅ Same database relationships and queries
- ✅ Same authentication flow and security
- ✅ Same stock calculation methods
- ✅ Same discount and pricing logic

### Improvements Made

- 🚀 TypeScript for better type safety
- 🚀 Modern NestJS architecture
- 🚀 Drizzle ORM for better performance
- 🚀 Comprehensive validation with DTOs
- 🚀 Better error handling and responses
- 🚀 Modular and scalable structure

### Database Schema

All original database tables have been converted to Drizzle ORM schemas:

- Users, Customers, Tokens
- Products, Main Products, Product Images
- Orders, Order Details, Cart
- Reviews, Wishlists, Notifications
- Menus, Categories, Brands
- And many more...

## 🧪 Testing

```bash
# Run tests
yarn test

# Run e2e tests
yarn test:e2e

# Test coverage
yarn test:cov
```

## 📝 Development

```bash
# Start in development mode
yarn start:dev

# Build for production
yarn build

# Start production server
yarn start:prod
```

## 🔐 Environment Variables

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=finesse_db

# Application
APP_NAME=Finesse API
APP_KEY=your-secret-key
APP_URL=http://localhost:3000
PORT=3000

# JWT
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d

# SMS (for OTP)
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=your-sender-id
```

## 🤝 Contributing

1. Follow the existing code structure
2. Maintain the same business logic
3. Add proper TypeScript types
4. Include validation for all inputs
5. Write tests for new features

## 📄 License

This project maintains the same license as the original AdonisJS application.

---

**Note**: This is a complete conversion that maintains 100% of the original business logic while modernizing the technology stack. All original functionality has been preserved and enhanced with TypeScript and modern NestJS patterns.

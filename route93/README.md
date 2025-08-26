# Route93 E-commerce Store

A full-featured e-commerce platform built with RedwoodJS, featuring modern UI, secure payments, comprehensive admin management, and production-ready deployment.

## 🚀 Features

### Customer Experience
- **🛍️ Product Browsing**: Browse products by categories and collections with beautiful UI
- **🔍 Advanced Search**: Smart search with filters, sorting, and search suggestions
- **🛒 Shopping Cart**: Persistent cart with local storage and database sync for authenticated users
- **💳 Secure Checkout**: Stripe integration with comprehensive payment error handling
- **📦 Order Management**: Order confirmation, tracking, and detailed order history
- **👤 User Authentication**: Secure sign up/sign in with role-based access control
- **📱 Responsive Design**: Mobile-first design that works on all devices

### Admin Management
- **📊 Dashboard**: Real-time analytics and business intelligence
- **📦 Product Management**: Full CRUD operations with inventory tracking
- **🏷️ Category Management**: Organize products into hierarchical categories
- **📚 Collection Management**: Create themed product collections
- **📋 Order Management**: Process orders with status updates and payment tracking
- **👥 User Management**: Customer account management with role assignment
- **📈 Inventory Tracking**: Stock level monitoring with low stock alerts
- **📊 Analytics & Reports**: Sales reports, popular products, and user activity insights
- **💳 Payment Tracking**: Failed payment monitoring and retry management

### Advanced Features
- **🔒 Role-Based Access Control**: Admin/Customer role separation
- **❌ Failed Payment Handling**: Comprehensive error handling with retry logic
- **🔄 Cart Synchronization**: Seamless cart sync between devices for logged-in users
- **📧 Order Notifications**: Email confirmations and status updates
- **🎨 Modern UI/UX**: Purple and green theme with Tailwind CSS
- **⚡ Performance Optimized**: Fast loading with optimized queries and caching

## 🛠️ Technology Stack

- **Frontend**: React 18 with Tailwind CSS
- **Backend**: RedwoodJS with GraphQL API
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: RedwoodJS dbAuth with session management
- **Payments**: Stripe with comprehensive error handling
- **Deployment**: Vercel with automatic CI/CD
- **Monitoring**: Health checks and error tracking ready

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 20.x
- Yarn package manager
- Git
- PostgreSQL (for production)

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/route93.git
   cd route93
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```bash
   DATABASE_URL="file:./dev.db"
   SESSION_SECRET="your-super-secret-session-key"
   STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
   REDWOOD_ENV_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
   ```

4. **Set up the database**:
   ```bash
   yarn rw prisma migrate dev
   yarn rw prisma db seed
   ```

5. **Start the development server**:
   ```bash
   yarn rw dev
   ```

6. **Open your browser** to `http://localhost:8910`

## 👤 Default Accounts

After seeding the database:

### Admin Account
- **Email**: `admin@route93.com`
- **Password**: `admin123`
- **Access**: Full admin dashboard and management features

### Test Customer Account
- **Email**: `customer@route93.com`
- **Password**: `customer123`
- **Access**: Customer features and order history

## 🚀 Production Deployment

### Deploy to Vercel (Recommended)

1. **Prepare for deployment**:
   ```bash
   # Update database to PostgreSQL in schema.prisma
   # Set up production environment variables
   ```

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

3. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push to main

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.**

### Environment Variables for Production

Set these in your Vercel dashboard:

```bash
DATABASE_URL="postgresql://username:password@host:port/database"
SESSION_SECRET="your-production-session-secret"
STRIPE_SECRET_KEY="sk_live_your_live_stripe_key"
REDWOOD_ENV_STRIPE_PUBLISHABLE_KEY="pk_live_your_live_stripe_key"
```

## 🔧 Development

### Available Scripts

```bash
yarn rw dev          # Start development server
yarn rw build        # Build for production
yarn rw deploy vercel # Deploy to Vercel
yarn rw test         # Run tests
yarn rw storybook    # Start Storybook
yarn rw prisma studio # Open Prisma Studio
```

### Project Structure

```
route93/
├── api/                 # Backend API
│   ├── db/             # Database schema and migrations
│   ├── src/
│   │   ├── functions/  # Serverless functions
│   │   ├── graphql/    # GraphQL schemas
│   │   └── services/   # Business logic
├── web/                # Frontend React app
│   └── src/
│       ├── components/ # React components
│       ├── layouts/    # Page layouts
│       ├── pages/      # Route components
│       └── contexts/   # React contexts
└── scripts/           # Utility scripts
```

## 🧪 Testing

### Test Stripe Payments

Use these test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

### Health Checks

- **API Health**: `GET /api/health`
- **Database Health**: `GET /api/db-health`

## 📊 Monitoring

The application includes built-in monitoring:

- **Health Checks**: API and database connectivity monitoring
- **Error Tracking**: Failed payment logging and retry tracking
- **Performance**: Response time monitoring
- **Business Metrics**: Sales, orders, and user activity tracking

## 🔐 Security Features

- **Authentication**: Secure session-based authentication
- **Authorization**: Role-based access control (RBAC)
- **Payment Security**: PCI-compliant Stripe integration
- **Data Protection**: Encrypted sensitive data
- **CORS**: Properly configured cross-origin requests
- **SQL Injection**: Prisma ORM protection

## 🎨 Customization

### Theme Colors
The application uses a purple and green theme. Customize in:
- `web/src/index.css` - Global styles
- Tailwind classes throughout components

### Adding Features
1. Create GraphQL schema in `api/src/graphql/`
2. Implement service in `api/src/services/`
3. Create React components in `web/src/components/`
4. Add routes in `web/src/Routes.jsx`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
- **Issues**: Open an issue on GitHub
- **Email**: support@route93.com
- **Health Checks**: Monitor `/api/health` and `/api/db-health`

## 🎉 Acknowledgments

Built with:
- [RedwoodJS](https://redwoodjs.com/) - Full-stack framework
- [Stripe](https://stripe.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Prisma](https://prisma.io/) - Database ORM
- [Vercel](https://vercel.com/) - Hosting platform

---

**Happy selling with Route93! 🛒✨**
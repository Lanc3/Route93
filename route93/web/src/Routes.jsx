// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set, PrivateSet } from '@redwoodjs/router'
import MainLayout from 'src/layouts/MainLayout/MainLayout'

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      
      <Set wrap={MainLayout}>
          <Route path="/payment-failed" page={PaymentFailedPage} name="paymentFailed" />
          <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
          <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
        <PrivateSet unauthenticated="home" roles={["CLIENT", "ADMIN"]}>
          <Route path="/order-details/{id:Int}" page={OrderDetailsPage} name="orderDetails" />
          <Route path="/user-account" page={UserAccountPage} name="userAccount" />
          <Route path="/order-confirmation/{id:Int}" page={OrderConfirmationPage} name="orderConfirmation" />
        </PrivateSet>
        <PrivateSet unauthenticated="home" roles="ADMIN">
          <Route path="/admin/dashboard" page={AdminDashboardPage} name="adminDashboard" />
          <Route path="/admin/analytics" page={AdminAnalyticsPage} name="adminAnalytics" />
          <Route path="/admin/inventory" page={AdminInventoryPage} name="adminInventory" />
          <Route path="/admin/users/{id:Int}" page={AdminUserDetailsPage} name="adminUserDetails" />
          <Route path="/admin/users" page={AdminUsersPage} name="adminUsers" />
          <Route path="/admin/collections/{id:Int}/edit" page={AdminCollectionEditPage} name="adminCollectionEdit" />
          <Route path="/admin/collections/add" page={AdminCollectionAddPage} name="adminCollectionAdd" />
          <Route path="/admin/collections" page={AdminCollectionsPage} name="adminCollections" />
          <Route path="/admin/orders" page={AdminOrdersPage} name="adminOrders" />
          <Route path="/admin/categories/{id:Int}/edit" page={AdminCategoryEditPage} name="adminCategoryEdit" />
          <Route path="/admin/categories/add" page={AdminCategoryAddPage} name="adminCategoryAdd" />
          <Route path="/admin/products/{id:Int}/edit" page={AdminProductEditPage} name="adminProductEdit" />
          <Route path="/admin/products/add" page={AdminProductAddPage} name="adminProductAdd" />
          <Route path="/admin/categories" page={AdminCategoriesPage} name="adminCategories" />
          <Route path="/admin/products" page={AdminProductsPage} name="adminProducts" />
          <Route path="/admin" page={AdminPage} name="admin" />
        </PrivateSet>
        <Route path="/terms-of-service" page={TermsOfServicePage} name="termsOfService" />
        <Route path="/privacy-policy" page={PrivacyPolicyPage} name="privacyPolicy" />
        <Route path="/track-order" page={TrackOrderPage} name="trackOrder" />
        <Route path="/size-guide" page={SizeGuidePage} name="sizeGuide" />
        <Route path="/help-center" page={HelpCenterPage} name="helpCenter" />
        <Route path="/returns" page={ReturnsPage} name="returns" />
        <Route path="/shipping" page={ShippingPage} name="shipping" />
        <Route path="/faq" page={FaqPage} name="faq" />
        <Route path="/signup" page={SignupPage} name="signup" />
        <Route path="/about" page={AboutPage} name="about" />
        <Route path="/contact" page={ContactPage} name="contact" />
        <Route path="/login" page={LoginPage} name="login" />
        <Route path="/checkout" page={CheckoutPage} name="checkout" />
        <Route path="/collections" page={CollectionsPage} name="collections" />
        <Route path="/product/{id:Int}" page={ProductPage} name="product" />
        <Route path="/products" page={ProductsPage} name="products" />
        <Route path="/cart" page={CartPage} name="cart" />
        <Route path="/" page={HomePage} name="home" />
        <Route notfound page={NotFoundPage} />
      </Set>
    </Router>
  )
}

export default Routes

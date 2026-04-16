# Retail_Ordering_Website_

A seamless retail ordering platform designed for a pizza and beverage outlet. This application enables customers to browse menus, manage a shopping cart, and place secure orders while maintaining real-time inventory synchronization.
-------------------

# 🚀 Key Features:

# Customer Enablement:

1. Menu Exploration: Browse through various brands, categories (Pizza, Cold Drinks, Breads), and packaging options.

2. Seamless Ordering: Integrated shopping cart and streamlined checkout process.

3. Order History: View past orders and utilize the "Quick Reorder" feature (Stretch).

4.Promotions: Support for coupons, loyalty points, and seasonal offers (Stretch).

------------------


# Technical Core

1. Real-time Inventory: Automatic updates to stock levels upon order confirmation.

2. Secure API: ASP.NET Core Web API protected by Authentication, Authorization, and Rate Limiting.

3.Validated Endpoints: RESTful architecture documented and tested via Swagger and Postman.

4.Automated Notifications: Email confirmation sent upon successful order placement (Stretch).

# 🛠️ Technology Stack

LayerTechnologyFrontendAngular Framework, TypeScript, RxJSBackendASP.NET Core Web API (C#)ORMEntity Framework CoreDatabaseSQL ServerDocumentationSwagger / OpenAPIVersion ControlGitHub🏗️ Getting StartedPrerequisites.NET 8.0 SDK or higherNode.js (v18+ recommended)Angular CLISQL ServerInstallation & SetupClone the RepositoryBashgit clone https://github.com/your-username/retail-ordering-website.git
cd retail-ordering-website
Database ConfigurationUpdate the ConnectionStrings in appsettings.json within the API project to point to your local SQL Server instance.JSON"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=RetailOrderDB;Trusted_Connection=True;"
}
Backend SetupBashcd Backend/ApiProject
dotnet ef database update
dotnet run
Frontend SetupBashcd Frontend/AngularProject
npm install
ng serve
📡 API DocumentationOnce the backend is running, you can access the interactive Swagger UI to explore the API endpoints:http://localhost:XXXX/swagger/index.html📂 Project Structure/Frontend: Angular source code, components, and services./Backend: ASP.NET Core controllers, EF Core Models, and Data Context./Docs: Postman collections and design documents.

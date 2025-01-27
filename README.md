### EasyRentals

This project is an e-commerce web app that lists residential rental properties in the market for easier access to potential tenants. The application implements a backend API that returns a list of available properties and allows for filtering based on different criteria such as location, price, amenities, etc.

It is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Property Listings**: Add, edit, delete, and view properties.
- **User Authentication**: Secure login and session management.
- **Search and Filter**: Search properties by location, price, bedrooms, etc.
- **Contact Property Owner**: Contact property owners directly.
- **Responsive Design**: Works well on different devices.

## Technology Stack

- **Frontend**: React, Next.js
- **Backend**: Node.js, Next.js API routes
- **Database**: MongoDB
- **Authentication**: Redis for session management

## API Endpoints

### Authentication Endpoints

- **POST /api/auth/login**: Authenticates a user using email and password.
- **POST /api/auth/registration**: Registers a new user.

### Property Endpoints

- **GET /api/properties**: Fetches a list of properties based on query parameters.
- **POST /api/properties**: Adds a new property.
- **PUT /api/properties/[id]**: Updates an existing property.
- **DELETE /api/properties/[id]**: Deletes an existing property.

### Property View Endpoint

- **GET /api/properties/view/[id]**: Fetches details of a specific property by ID.

### Featured Properties Endpoint

- **GET /api/properties/featured**: Fetches a list of featured properties.

### Search Endpoint

- **GET /api/search**: Searches for properties based on a query parameter.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

## Contact

- **Email**: bonyomichael406@gmail.com@example.com
- **GitHub**: [Project Repository](https://github.com/maiko254/easyrentals)
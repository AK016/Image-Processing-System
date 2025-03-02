# Image Processing System

This is an image processing system built with Node.js that allows you to upload a CSV file, process images asynchronously, and store the results. The system performs compression on the uploaded images and saves the processed image URLs in the output CSV file, along with the original input data.

## Features

- **Upload CSV**: Upload a CSV file containing product data and image URLs.
- **Image Processing**: The system will download the images, compress them by 50%, and store them locally.
- **Database Storage**: The processed image data is stored in the database, linked to the request.
- **Download Processed Data**: A CSV file with processed image URLs is generated and made available for download.
- **Request Status**: Query the status of image processing for a specific request ID.

## Technologies Used

- Node.js
- Express.js
- MongoDB (for storing request and processed data)
- Sharp (for image processing)
- CSV Parser (to handle CSV file parsing)
- json2csv (for generating output CSV)

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/image-processing-system.git
cd image-processing-system
```

### 2. Install Dependencies

Run the following command to install all the necessary dependencies:

```bash
npm install
```

### 3. Environment Variables

Make sure you have the necessary environment variables configured for your app. You may need to create a `.env` file to define these values, especially the database URI.

Example `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/image-processing
PORT=5000
```

### 4. Run the Application

Start the application by running:

```bash
npm start
```

The application will now be running at `http://localhost:5000`.

## API Endpoints

### 1. **Upload CSV**

- **Endpoint**: `POST /api/upload`
- **Description**: Upload a CSV file containing product information and image URLs.
- **Request Body**: Multipart form data (CSV file)
- **Response**: `{ message: "File uploaded and processed successfully!", requestId: "<unique-request-id>", path: "<file-path>" }`

### 2. **Get Status**

- **Endpoint**: `GET /api/status/:requestId`
- **Description**: Retrieve the status of a request by its unique request ID.
- **Response**: `{ requestId, status: "<status>" }`

### 3. **Download Output CSV**

- **Endpoint**: `GET /api/download/:requestId`
- **Description**: Download the processed CSV file with the output image URLs.
- **Response**: CSV file for download

## Database Schema

### Request Model

- `requestId`: Unique identifier for the request (UUID)
- `status`: The current status of the processing (e.g., "Processing", "Completed")
- `inputData`: The original data from the CSV
- `outputData`: The processed image data (including URLs)

## Example CSV Format

The input CSV file should be formatted with the following columns:

| Serial Number | Product Name | Input Image URLs |
|---------------|--------------|------------------|
| 001           | Product A    | http://example.com/image1.jpg,http://example.com/image2.jpg |
| 002           | Product B    | http://example.com/image3.jpg |

### Example of Output CSV:

After processing, the output CSV will have the following format:

| Serial Number | Product Name | Input Image URLs                                  | Output Image URLs                              |
|---------------|--------------|--------------------------------------------------|------------------------------------------------|
| 001           | Product A    | http://example.com/image1.jpg,http://example.com/image2.jpg | http://localhost:5000/uploads/<image1.jpg>,http://localhost:5000/uploads/<image2.jpg> |
| 002           | Product B    | http://example.com/image3.jpg                    | http://localhost:5000/uploads/<image3.jpg>     |

## Error Handling

The following errors may occur:

- **400 Bad Request**: Invalid CSV format or missing required fields
- **404 Not Found**: Request ID not found
- **500 Internal Server Error**: Error during file processing or database interaction

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to modify the README to match your exact needs. Let me know if you need any further adjustments or additions!
``` 

This file should provide a comprehensive overview of your project and guide anyone using or developing it further.

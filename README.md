# **PharmAssist**  

#### Participant name: Harshita Mahbubani
#### Project name : PharmAssist

## **Overview**
This project is being submitted as part of the Ideathon round of the **Google Girl Hackathon 2025**. PharmAssist is a prototype designed to showcase how AI can revolutionize pharmacy workflows by automating prescription processing, inventory management, and order fulfillment.

## **Problem Statement**  

Pharmacists handle a high volume of prescriptions daily, often dealing with handwritten notes, manual order processing, and inventory management challenges. These inefficiencies can lead to errors, delays, and stock mismanagement, impacting both pharmacists and patients. **PharmAssist** aims to automate these processes using AI and machine learning, ensuring accuracy, efficiency, and seamless pharmacy operations.  

## **Solution**  

PharmAssist is an **AI-powered prescription management system** designed to simplify pharmacy workflows:  

- **Optical Character Recognition (OCR)**: Leverages **EasyOCR and DeepSeek Vision R1** to accurately extract and validate text from handwritten prescriptions.  
- **QR-Based Ordering**: Patients can scan a **QR code, upload their prescription**, and place orders directly from their phones.  
- **Automated Inventory & Order Management**: Tracks stock levels, streamlines order fulfillment, and prevents shortages or overstocking.  
- **Pharmacist Dashboard**: Provides real-time insights into **sales, stock levels, and revenue analytics** for better decision-making.  

## **Technologies Used**  

- **AI & OCR**: EasyOCR, DeepSeek Vision R1 for handwriting recognition.  
- **Backend**: Node.js, Express.js for API development.  
- **Frontend**: React.js for an interactive and user-friendly interface.  
- **Database**: MongoDB for efficient data storage and retrieval.  
- **Deployment**: Hosted on **AWS**, with secure API tunneling via **Ngrok** for remote accessibility.  
- **Security**: Encrypted prescription data, authentication mechanisms, and compliance with industry standards.  

By automating **prescription processing, inventory tracking, and revenue management**, **PharmAssist enhances efficiency, reduces errors, and improves pharmacy operations**, ultimately benefiting both pharmacists and patients.  

## Requirements

### Frontend
- Node.js (v14 or higher)
- npm (v6 or higher)

### Backend
- Python 3.8 or higher
- Flask

## Getting Started- How to run this project on your local machine

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in your terminal).

### Backend Setup

1. Create a virtual environment (recommended):
```bash
python -m venv venv
```

2. Activate the virtual environment:
- On Windows:
  ```bash
  .\venv\Scripts\activate
  ```
- On macOS/Linux: 
  ```bash
  source venv/bin/activate
  ```

3. Install Python dependencies:
```bash
pip install flask
```

4. Start the Flask server:
```bash
python app.py
```

The backend will be available at `http://localhost:5000`.

## Development

- Frontend code is in the `frontend/` directory
- Backend Flask application is in `app.py`
- Make sure both frontend and backend servers are running for full functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

 

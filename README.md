
---

```md
# CSV Bulk Upload Frontend

A modern **Next.js** application for uploading and processing CSV files with real-time progress tracking and large file upload support.

---

## ✨ Features

- **Dual Upload Modes**
  - CSV file upload
  - Large file upload support (1GB+)

- **Real-time Progress Tracking**
  - Live upload percentage updates
  - Non-blocking UI updates

- **CSV Preview**
  - Instant client-side CSV preview before upload

- **Session Management**
  - Automatic recovery for interrupted uploads
  - Resume ongoing upload jobs

- **Responsive Design**
  - Mobile-friendly modern UI
  - Smooth animations

- **Error Handling**
  - User-friendly error messages

---

## 🛠️ Tech Stack

- **Next.js 16.0.3** (App Router)
- **TypeScript**
- **Axios + XMLHttpRequest**
- **CSS-in-JS**

---

## 📁 Project Structure
csv-bulk-upload-frontend/
├── app/
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main upload interface
├── components/
│   └── LargeFileUpload.tsx   # Large file upload component
├── lib/
│   └── api.ts                # API helper functions
└── package.json

---

## ⚙️ Installation

### Clone Repository
```bash
git clone <repository-url>
cd csv-bulk-upload-frontend
````

### Install Dependencies

```bash
npm install
```

---

## 🔧 Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:1337
```

---

## ▶️ Run Development Server

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:3000
```

---

## 🔗 Backend Integration

Backend Repository: **CSV Bulk Upload Backend**

### API Endpoints

```http
POST /api/todos/bulk-upload          # Start CSV upload
GET  /api/todos/upload-status/:jobId # Check upload progress
POST /api/todos/clear-session        # Clear session
POST /api/upload/large-file          # Upload large files
```

---

## 🔄 How It Works

### CSV Upload Flow

```
User selects CSV file
   ↓
Client-side preview generation
   ↓
File uploaded to backend
   ↓
Job ID returned
   ↓
Frontend polls progress every second
   ↓
Upload completion
```

### Large File Upload Flow

```
User selects large file
   ↓
XMLHttpRequest tracks upload progress
   ↓
Real-time progress updates
   ↓
Backend confirmation
```

---

## 🧠 Session Management

* Auto-detect interrupted uploads
* Resume active upload jobs
* Automatic cleanup after completion

---

## 🎨 User Interface

### Main Components

* Upload mode toggle (CSV / Large File)
* Drag & drop file zone
* Real-time progress bars
* CSV preview table
* Error alert messages

### Design Features

* Blue gradient background
* Card-based layout with shadows
* Responsive UI
* Smooth animations

---

## ⚙️ Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:1337
```

---

## 📂 Supported Files

* **CSV Mode**: `.csv` files only
* **Large File Mode**: Any file type (1GB+ optimized)

---

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Vercel Deployment

* Connect GitHub repository to Vercel
* Set environment variables in dashboard
* Auto-deploy on push to `main`

---

## ⚡ Performance Features

* Chunked uploads for large files
* Non-blocking progress tracking
* Session recovery
* Memory-optimized CSV parsing

## 📄 License

MIT License

---

## Backend Integration
Backend Repository: **https://github.com/harikrishnan2193/csv_upload_frontend**
# 🔍 Lost and Found Cloud System

A cloud-native microservice-based Lost and Found management system deployed on Google Cloud Platform (GCP).

---

## 🌐 Live Services

| Service | URL |
|---|---|
| 🟢 **Eureka Dashboard** | http://34.47.225.165:8761 |
| 🌐 **API Gateway** | http://34.47.225.165:9000 |
| ⚙️ **Config Server** | http://34.47.225.165:8000 |

---

## 🏗️ Architecture Overview

This system follows a **Microservice Architecture** using Spring Boot and Spring Cloud, deployed on GCP with high availability and auto-scaling support.

```
Frontend (Web App)
       ↓
  API Gateway (:9000)
       ↓
 ┌─────┬─────┬──────┐
 ↓     ↓     ↓      ↓
User  Item  Claim  Config
(:8082)(:8083)(:8084) (:8000)
 ↓     ↓     ↓
MySQL MongoDB MySQL
```

---

## 🧩 Microservices

### 1. User Service — Port `8082`
- Handles user registration and authentication
- **Database:** MySQL (`user_service_db`) via Cloud SQL

### 2. Item Service — Port `8083`
- Manages lost and found item listings
- **Database:** MongoDB Atlas (`item-service-db`)
- **Cloud Storage:** GCS Bucket (`lostandfoundsystem`) for item images

### 3. Claim Service — Port `8084`
- Handles item claim requests
- **Database:** MySQL (`claim_db`) via Cloud SQL

---

## ⚙️ Platform Components

| Component | Port | Description |
|---|---|---|
| Config Server | 8000 | Centralized configuration management |
| Eureka Server | 8761 | Service registration and discovery |
| API Gateway | 9000 | Single entry point for all services |

---

## 🗄️ Database

| Type | Technology | Usage |
|---|---|---|
| Relational | MySQL (Cloud SQL) | User Service, Claim Service |
| Non-Relational | MongoDB Atlas | Item Service |

---

## ☁️ GCP Infrastructure

| Resource | Name |
|---|---|
| VM Instance | `lost-found-vm` |
| Instance Template | `lost-found-template` |
| Instance Group | `lost-found-instance-group` |
| Disk Image | `lost-found-imag` |
| Health Check | `lost-found-health-check` |
| Load Balancer | `lost-found-lb` |
| Cloud NAT | `lost-found-nat` |
| Cloud Router | `lost-found-router` |
| Cloud DNS | `lost-found-zone` |
| Cloud SQL | `lost-found-mysql` |
| Storage Bucket | `lostandfoundsystem` |
| VPC Network | `default` |

---

## 📦 Repository Structure (Polyrepo + Git Submodules)

```
Lost-and-found-cloud-system/   ← Main Repo
├── api-gateway/               ← Submodule
├── config-server/             ← Submodule
├── eureka-server/             ← Submodule
├── user-services/             ← Submodule
├── item-service/              ← Submodule
├── claim-service/             ← Submodule
├── web-app/                   ← Frontend
└── .gitmodules
```

---

## 🔌 API Endpoints (via API Gateway)

| Method | Endpoint | Service |
|---|---|---|
| GET/POST | `/api/users/**` | User Service |
| GET/POST | `/auth/**` | User Service |
| GET/POST | `/api/items/**` | Item Service |
| GET/POST | `/api/claims/**` | Claim Service |

---

## 🚀 Process Management

All services are managed by **PM2** on the VM instances.

```bash
# Check running services
pm2 list

# Monitor services
pm2 monit

# PM2 auto-starts on VM restart
pm2 startup
pm2 save
```

---

## 📁 Cloud Storage

Item images are stored in GCS bucket: **`lostandfoundsystem`**

- Uploaded via Item Service
- Accessible through API Gateway

---

## 🛠️ Tech Stack

- **Backend:** Java, Spring Boot, Spring Cloud
- **Frontend:** React (Vite)
- **Databases:** MySQL, MongoDB Atlas
- **Cloud:** Google Cloud Platform (GCP)
- **Process Manager:** PM2
- **Service Discovery:** Eureka
- **Config Management:** Spring Cloud Config
- **API Gateway:** Spring Cloud Gateway

---

## 👩‍💻 Author

**Nethmi Dileksha Kavindi**  
Higher Diploma in Software Engineering  
ITS 2130 — Enterprise Cloud Architecture  
IJSE

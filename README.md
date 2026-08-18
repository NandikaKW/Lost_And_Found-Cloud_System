# 🔍 Lost and Found Cloud System

A cloud-native, microservice-based Lost and Found management system deployed on Google Cloud Platform (GCP).

---

## 👤 Student Information

- **Student Name:** Nandika Kaweesha Fernando
- **Student ID:** <STUDENT_ID>
- **Slack Handle:** (optional)
- **GCP Project ID:** `lost-and-found-505717`

---

## 🌐 Live Services (internal — VPC-private, not internet-accessible)

These services run on private internal IPs inside the `lostfound-vpc` VPC network and are only reachable from within that network (by design, for security). They are not exposed to the public internet directly — access is intended through the API Gateway / Load Balancer.

| Service | Internal Address |
|---|---|
| 🟢 **Eureka Dashboard** | `http://10.10.0.10:8761` |
| 🌐 **API Gateway** | `http://10.10.0.10:9000` |
| ⚙️ **Config Server** | `http://10.10.0.10:8000` |

---

## 🏗️ Architecture Overview

This system follows a **Microservice Architecture** using Spring Boot 4.1.0 and Spring Cloud 2025.1.2 (Java 25), deployed on GCP with high availability and auto-scaling support via Managed Instance Groups and a global Load Balancer.


---

## 🧩 Microservices

### 1. User Service — Port `8082`
- Handles user registration, authentication, and role management (user/admin)
- **Database:** MySQL (`user_service_db`) via Cloud SQL, private IP `10.209.96.3`

### 2. Item Service — Port `8083`
- Manages lost and found item listings (create, browse, filter, status updates)
- **Database:** MongoDB (`lost-and-found-microservice`) — self-hosted on `mongo-vm`, internal IP `10.10.0.2`
- **Cloud Storage:** GCS Bucket (`lost-and-found-505717-images`) for item photo uploads

### 3. Claim Service — Port `8084`
- Handles item claim requests and approve/reject workflow
- **Database:** MySQL (`claim_service_db`) via Cloud SQL, private IP `10.209.96.3`

---

## ⚙️ Platform Components

| Component | Port | VM | Internal IP | Description |
|---|---|---|---|---|
| Eureka Server | 8761 | `platform-vm` | `10.10.0.10` | Service registration and discovery |
| Config Server | 8000 | `platform-vm` | `10.10.0.10` | Centralized configuration management |
| API Gateway | 9000 | `platform-vm` | `10.10.0.10` | Single entry point for all backend services |

---

## 🗄️ Database

| Type | Technology | Host | Used By |
|---|---|---|---|
| Relational | MySQL 8.4 (Cloud SQL, Enterprise edition) | `10.209.96.3` | User Service (`user_service_db`), Claim Service (`claim_service_db`) |
| Non-Relational | MongoDB 7.0 (self-hosted on Compute Engine) | `10.10.0.2` | Item Service (`lost-and-found-microservice`) |
| Document Store | Firestore (Native mode) | Managed | Audit logging |

---

## ☁️ GCP Infrastructure

| Resource | Name | Details |
|---|---|---|
| Project ID | `lost-and-found-505717` | — |
| VPC Network | `lostfound-vpc` | Custom mode, region `asia-south1` |
| Subnet | `lostfound-subnet` | `10.10.0.0/20`, Private Google Access enabled |
| Firewall Rules | `allow-internal`, `allow-iap-ssh`, `allow-health-check`, `allow-http-https` | Least-privilege ingress rules |
| Cloud Router | `lostfound-router` | `asia-south1` |
| Cloud NAT | `lostfound-nat` | Outbound internet for private VMs |
| Cloud DNS | `lostfound-zone` | Managed zone |
| Cloud SQL | `lostfound-mysql` | MySQL 8.4, Enterprise edition, private IP only |
| MongoDB VM | `mongo-vm` | `10.10.0.2`, Ubuntu 24.04, self-hosted MongoDB 7.0 |
| Platform VM | `platform-vm` | `10.10.0.10`, Ubuntu 24.04, e2-medium |
| Services VM | `services-vm` | `10.10.0.20`, Ubuntu 24.04, e2-medium |
| Storage Bucket | `lost-and-found-505717-images` | Public read access, Standard storage class |
| Service Accounts | `lostfound-app-sa`, `lostfound-storage-sa` | Least-privilege IAM roles |
| Workload Identity Federation | `github-pool` / `github-provider` | Keyless auth for GitHub Actions CI/CD |

---

## 📦 Repository Structure (Polyrepo + Git Submodules)


---

## 🔌 API Endpoints (via API Gateway)

| Method | Endpoint | Service |
|---|---|---|
| GET / POST | `/api/users/**` | User Service |
| POST | `/auth/**` | User Service (login) |
| GET / POST / PATCH / DELETE | `/api/items/**` | Item Service |
| GET / POST / PATCH / DELETE | `/api/claims/**` | Claim Service |

CORS is configured on the API Gateway to allow requests from the deployed frontend origin.

---

## 🚀 Process Management (PM2)

Since services run directly on Compute Engine VMs (not containerized), **PM2** manages all Java processes — starting them, restarting them on failure, and re-starting them automatically after a VM reboot.

```bash
# Check running services
pm2 status

# View logs for a specific service
pm2 logs item-service --lines 50 --nostream

# Monitor CPU / memory live
pm2 monit

# Persist the current process list and enable auto-start on VM reboot
pm2 save
pm2 startup   # run the printed command once to register with systemd
```

**Platform VM** (`10.10.0.10`) runs: `eureka-server`, `config-server`, `api-gateway`
**Services VM** (`10.10.0.20`) runs: `user-services`, `item-service`, `claim-service`

---

## 📁 Cloud Storage

Item photos are stored in the GCS bucket: **`lost-and-found-505717-images`**

- Uploaded by Item Service via the Google Cloud Storage Java client
- Publicly readable (`Storage Object Viewer` granted to `allUsers`)
- Object naming convention: `items/<uuid>_<original-filename>`

---

## 🛠️ Tech Stack

- **Backend:** Java 25, Spring Boot 4.1.0, Spring Cloud 2025.1.2 (Oakwood)
- **Frontend:** React 19 + Vite + TypeScript
- **Databases:** MySQL 8.4 (Cloud SQL), MongoDB 7.0 (self-hosted)
- **Cloud:** Google Cloud Platform (Compute Engine, Cloud SQL, Firestore, Cloud Storage, Cloud DNS, Cloud NAT, Load Balancing)
- **Process Manager:** PM2
- **Service Discovery:** Netflix Eureka
- **Config Management:** Spring Cloud Config Server
- **API Gateway:** Spring Cloud Gateway
- **IAM:** Service Accounts + Workload Identity Federation (keyless GitHub Actions auth)

---

## 🖥️ Getting Started (Local Development)

```bash
# Clone with all submodules
git clone --recurse-submodules https://github.com/NandikaKW/Lost_And_Found-Cloud_System.git
cd Lost_And_Found-Cloud_System

# Build a service (example: item-service)
cd item-service
mvn clean package -DskipTests

# Run it
java -jar target/item-service-0.0.1-SNAPSHOT.jar
```

Each service's `application.properties` points to the GCP-hosted databases and platform services by default. For fully local development, override `spring.datasource.url`, `spring.data.mongodb.uri`, and the Eureka/Config Server URLs to point at `localhost`.

---

## 👩‍💻 Author

**Nandika Kaweesha Fernando**

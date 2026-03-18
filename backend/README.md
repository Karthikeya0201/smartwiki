# Smart Personalized Product Wiki Backend

A complete FastAPI backend for personalized product documentation with feature-based access control, version history, and role-based authorization.

## Features
- **JWT-based Authentication** (Register/Login)
- **Role-Based Access Control** (RBAC): `admin` and `user` roles
- **Feature Management**: Admins can create and assign features to users
- **Document Management**: CRUD for documentation belonging to specific features
- **Dynamic Access Filtering**: Users only see documents for features assigned to them
- **Version Control**: Automatic archiving of old document versions when updated
- **Versioning API**: Access to current and historical versions
- **Search System**: Search documents by title/content with access filtering
- **Clean Architecture**: Modular structure (routers, models, schemas, services, database)
- **MongoDB Implementation**: Using `Motor` (Async)

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Database Configuration**:
   Create a `.env` file based on `.env.example`.
   ```bash
   SECRET_KEY=yoursecretkey
   MONGO_URL=mongodb://localhost:27017
   DATABASE_NAME=product_wiki_db
   ```

3. **Initialize Admin (Optional Seed)**:
   ```bash
   python -m app.scripts.init_db
   ```
   *Note: Ensure your MongoDB server is running.*

4. **Run Application**:
   ```bash
   uvicorn main:app --reload
   ```

## Example API Requests

### 1. Authentication

**Register:**
```bash
curl -X POST "http://127.0.0.1:8000/register" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Jane User",
       "email": "jane@example.com",
       "password": "password123",
       "role": "user"
     }'
```

**Login:**
```bash
curl -X POST "http://127.0.0.1:8000/login" \
     -F "username=admin@example.com" \
     -F "password=admin123"
```
*(Copy the `access_token` from response for subsequent requests)*

### 2. Administrator Actions

**Create Feature:**
```bash
curl -X POST "http://127.0.0.1:8000/features" \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Dashboard",
       "description": "Main platform dashboard and analytics overview"
     }'
```

**Assign Feature to User:**
```bash
curl -X PUT "http://127.0.0.1:8000/assign-features/<USER_ID>" \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '["<FEATURE_ID>"]'
```

**Create Document:**
```bash
curl -X POST "http://127.0.0.1:8000/documents" \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Welcome to Dashboard",
       "content": "This is the tutorial for the main dashboard.",
       "feature_id": "<FEATURE_ID>",
       "category": "Tutorial"
     }'
```

### 3. User Actions (Access Controlled)

**List Documents:**
```bash
curl -X GET "http://127.0.0.1:8000/documents" \
     -H "Authorization: Bearer <TOKEN>"
```

**Search Documents:**
```bash
curl -X GET "http://127.0.0.1:8000/search?query=tutorial" \
     -H "Authorization: Bearer <TOKEN>"
```

**View Change History:**
```bash
curl -X GET "http://127.0.0.1:8000/documents/<DOC_ID>/versions" \
     -H "Authorization: Bearer <TOKEN>"
```

---

## Folder Structure
- `/app`
  - `/core`: Settings, JWT, Security, Dependencies
  - `/database`: MongoDB / Motor setup
  - `/schemas`: Pydantic Models for requests/responses
  - `/services`: Business logic (CRUD, Filtering, Versioning)
  - `/routers`: API endpoints
- `main.py`: Entry point and lifespan management

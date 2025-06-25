# File Upload API Documentation

## Overview
The Warriors API now supports file uploads for images related to warriors, races, powers, magic, and warrior types using Multer middleware.

## Upload Endpoints

### 1. Race Image Upload

#### Create Race with Image
```http
POST /api_v1/race
Content-Type: multipart/form-data

Form Data:
- name: "Human"
- description: "Balanced warriors with good adaptability"
- image: [FILE] (image file)
```

#### Update Race with Image
```http
PUT /api_v1/race/:id
Content-Type: multipart/form-data

Form Data:
- name: "Updated Human"
- description: "Updated description"
- image: [FILE] (optional - new image file)
```

#### Upload Race Image Only
```http
POST /api_v1/race/:id/upload-image
Content-Type: multipart/form-data

Form Data:
- image: [FILE] (image file)
```

### 2. Warrior Image Upload

#### Create Warrior with Image
```http
POST /api_v1/warrior
Content-Type: multipart/form-data

Form Data:
- name: "Aragorn"
- description: "Noble human warrior"
- level: 5
- health: 120
- energy: 80
- attack: 25
- defense: 20
- speed: 15
- warrior_type_id: 1
- race_id: 1
- image: [FILE] (image file)
```

#### Upload Warrior Image Only
```http
POST /api_v1/warrior/:id/upload-image
Content-Type: multipart/form-data

Form Data:
- image: [FILE] (image file)
```

### 3. Power Image Upload

#### Create Power with Image
```http
POST /api_v1/power
Content-Type: multipart/form-data

Form Data:
- name: "Berserker Rage"
- description: "Increases attack power"
- damage: "0"
- cooldown: 5
- image: [FILE] (image file)
```

#### Upload Power Image Only
```http
POST /api_v1/power/:id/upload-image
Content-Type: multipart/form-data

Form Data:
- image: [FILE] (image file)
```

### 4. Magic Image Upload

#### Create Magic with Image
```http
POST /api_v1/magic
Content-Type: multipart/form-data

Form Data:
- name: "Fireball"
- description: "Deals fire damage"
- mana_cost: 15
- damage: 35
- image: [FILE] (image file)
```

#### Upload Magic Image Only
```http
POST /api_v1/magic/:id/upload-image
Content-Type: multipart/form-data

Form Data:
- image: [FILE] (image file)
```

### 5. Warrior Type Image Upload

#### Create Warrior Type with Image
```http
POST /api_v1/warrior-type
Content-Type: multipart/form-data

Form Data:
- name: "Warrior"
- description: "Melee fighter with high defense"
- image: [FILE] (image file)
```

#### Upload Warrior Type Image Only
```http
POST /api_v1/warrior-type/:id/upload-image
Content-Type: multipart/form-data

Form Data:
- image: [FILE] (image file)
```

## File Constraints

- **Accepted formats**: JPEG, PNG, GIF, WebP
- **Maximum file size**: 5MB
- **Field name**: `image` (must use this exact field name)

## Response Examples

### Successful Upload Response
```json
{
  "message": "Race image uploaded successfully",
  "image": "image-1671234567890-123456789.jpg",
  "imageUrl": "/uploads/races/image-1671234567890-123456789.jpg"
}
```

### Error Responses

#### File Too Large
```json
{
  "error": "File too large. Maximum size is 5MB."
}
```

#### Invalid File Type
```json
{
  "error": "Only image files are allowed!"
}
```

#### Missing File
```json
{
  "error": "Image file is required"
}
```

## File Storage Structure

Files are stored in the following directory structure:
```
uploads/
├── races/          # Race images
├── warriors/       # Warrior images
├── powers/         # Power images
├── magic/          # Magic images
└── warriorTypes/   # Warrior type images
```

## Accessing Uploaded Images

Images can be accessed via HTTP at:
- `http://localhost:3000/uploads/races/{filename}`
- `http://localhost:3000/uploads/warriors/{filename}`
- `http://localhost:3000/uploads/powers/{filename}`
- `http://localhost:3000/uploads/magic/{filename}`
- `http://localhost:3000/uploads/warriorTypes/{filename}`

## JavaScript/Frontend Examples

### Using Fetch API
```javascript
// Create race with image
const formData = new FormData();
formData.append('name', 'Human');
formData.append('description', 'Balanced warriors');
formData.append('image', fileInput.files[0]);

fetch('/api_v1/race', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + adminToken
  },
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### Using HTML Form
```html
<form action="/api_v1/race" method="POST" enctype="multipart/form-data">
  <input type="text" name="name" placeholder="Race Name" required>
  <input type="text" name="description" placeholder="Description" required>
  <input type="file" name="image" accept="image/*">
  <button type="submit">Create Race</button>
</form>
```

## Authentication

- All upload endpoints require appropriate authentication:
  - Admin routes require `Authorization: Bearer {admin-token}`
  - Player routes require `Authorization: Bearer {player-token}`

## Notes

1. Images are optional for creation endpoints - you can create entities without images
2. The `upload-image` endpoints are specifically for adding/updating images on existing entities
3. File names are automatically generated to prevent conflicts
4. Old images are not automatically deleted when new ones are uploaded

# API Documentation

## App Engine URL https://chilichecker-capstone.et.r.appspot.com

### Endpoint: /register
- **Metode**: POST
- **URL**: https://chilichecker-capstone.et.r.appspot.com/register
- **Request Body**: username as string; email as string, must be unique; password as string, must be at least 6 characters

### Endpoint: /login
- **Metode**: POST
- **URL**: https://chilichecker-capstone.et.r.appspot.com/login
- **Request Body**: email as string; password as string, must be at least 6 characters

### Endpoint: /predict
- **Metode**: POST
- **URL**: https://chilichecker-capstone.et.r.appspot.com/predict
- **Headers**: Authorization: <token>
- **Request Body**: image as file

### Endpoint: /bookmark
- **Metode**: POST
- **URL**: https://chilichecker-capstone.et.r.appspot.com/bookmark
- **Headers**: Authorization: <token>
- **Request Body**: userId; idPredict; label; careInstructions; description; marketPrice; name; suitableDishes; image as file

### Endpoint: /bookmarklist
- **Metode**: GET
- **URL**: https://chilichecker-capstone.et.r.appspot.com/bookmarklist?userId
- **Headers**: Authorization: <token>

### Endpoint: /bookmarkdelete
- **Metode**: DELETE
- **URL**: https://chilichecker-capstone.et.r.appspot.com/bookmarkdelete?userId&idPredict
- **Headers**: Authorization: <token>

# Parents-in-the-Loop
An AI-powered interface targeted towards school systems to bridge language barriers for immigrant parents.

## Requirements
- MySQL
- OpenAI Key
- Python

## Frontend
- `cd frontend`
- `npm install`
- `npm run dev`
  
The frontend will start at localhost:3000

## Backend
- `cd backend`
- Optional: `source venv/bin/activate`
- `pip install -r requirements.txt`
- Prepare a MySQL server. See here for a starting point.
- Set environment variables at `backend/.env/`. The code below exemplifies the necessary format, but all values can be customized. Just ensure you have a running MySQL server, local or otherwise.

```bash
MYSQLDATABASE=hack4impact
MYSQLUSER=root
MYSQLPASSWORD=12345
MYSQLHOST=localhost
MYSQLPORT=3306

OPENAI_KEY=MY_OPENAI_KEY_HERE
```

- `python manage.py migrate`
- `python manage.py runserver`
  
The backend will start at localhost:8000

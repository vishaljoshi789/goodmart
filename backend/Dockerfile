# Use official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the project files
COPY . .

# Expose port 8000
EXPOSE 8000

# Start the server
CMD ["gunicorn", "goodmart.wsgi:application", "--bind", "0.0.0.0:8000"]